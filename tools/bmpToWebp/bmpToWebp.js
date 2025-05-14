#!/usr/bin/env node
// bmpToWebp.js

const fs       = require('fs');
const path     = require('path');
const yargs    = require('yargs');
const pLimitMod = require('p-limit');
const pLimit   = pLimitMod.default || pLimitMod;
const jimpMod  = require('jimp');
const Jimp     = jimpMod.default || jimpMod;

// ---- CLI Setup ----
const argv = yargs
    .option('input', {
        alias: 'i', describe: 'Directory containing BMP files', type: 'string', demandOption: true
    })
    .option('output', {
        alias: 'o', describe: 'Directory to write WebP files into', type: 'string', demandOption: true
    })
    .option('quality', {
        alias: 'q', describe: 'WebP quality (0–100)', type: 'number', default: 80
    })
    .option('concurrency', {
        alias: 'c', describe: 'Max parallel conversions', type: 'number', default: 5
    })
    .help()
    .argv;

const INPUT_DIR   = path.resolve(argv.input);
const OUTPUT_DIR  = path.resolve(argv.output);
const QUALITY     = argv.quality;
const CONCURRENCY = argv.concurrency;

// Ensure output dir exists
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const limit = pLimit(CONCURRENCY);

async function processFile(file) {
    const base    = path.basename(file, '.bmp');
    const inPath  = path.join(INPUT_DIR, file);
    const outPath = path.join(OUTPUT_DIR, `${base}.webp`);

    try {
        const img = await Jimp.read(inPath);
        await img
            .quality(QUALITY)      // for lossy WebP
            .writeAsync(outPath);
        console.log(`✔ ${file} → ${base}.webp`);
    } catch (err) {
        console.error(`✖ ${file}: ${err.message}`);
    }
}

(async () => {
    const files = fs.readdirSync(INPUT_DIR)
        .filter(f => f.toLowerCase().endsWith('.bmp'));

    const tasks = files.map(f => limit(() => processFile(f)));
    await Promise.all(tasks);

    console.log(`\n✅ Done! Converted ${files.length} BMPs to full-size WebP in ${OUTPUT_DIR}`);
})();
