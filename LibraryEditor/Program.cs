﻿namespace LibraryEditor {
    internal static class Program {
        public static string openFileWith { get; set; } = string.Empty;

        /// <summary>
        ///     The main entry point for the application.
        /// </summary>
        [STAThread]
        private static void Main(string[] args) {
            if(args.Length == 1) {
                FileInfo file = new(args[0]);
                if(file.Exists) {
                    openFileWith = args[0];
                }
            }

            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);
            Application.Run(new LMain());
        }
    }
}
