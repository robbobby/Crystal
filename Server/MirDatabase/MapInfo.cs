using System.Drawing;
using Server.Library.MirEnvir;
using Shared;

namespace Server.Library.MirDatabase {
    public class MapInfo {
        protected static Envir Envir => Envir.Main;

        protected static Envir EditEnvir => Envir.Edit;

        public int Index;
        public string FileName = string.Empty, Title = string.Empty;
        public ushort MiniMap, BigMap, Music;
        public LightSetting Light;
        public byte MapDarkLight = 0, MineIndex = 0;

        public bool NoTeleport,
            NoReconnect,
            NoRandom,
            NoEscape,
            NoRecall,
            NoDrug,
            NoPosition,
            NoFight,
            NoThrowItem,
            NoDropPlayer,
            NoDropMonster,
            NoNames,
            NoMount,
            NeedBridle,
            Fight,
            NeedHole,
            Fire,
            Lightning,
            NoTownTeleport,
            NoReincarnation;

        public string NoReconnectMap = string.Empty;
        public int FireDamage, LightningDamage;

        public List<SafeZoneInfo> SafeZones = new();
        public List<MovementInfo> Movements = new();
        public List<RespawnInfo> Respawns = new();
        public List<NpcInfo> Npcs = new();
        public List<MineZone> MineZones = new();
        public List<Point> ActiveCoords = new();
        public WeatherSetting WeatherParticles = WeatherSetting.None;

        public MapInfo() { }

        public MapInfo(BinaryReader reader) {
            Index = reader.ReadInt32();
            FileName = reader.ReadString();
            Title = reader.ReadString();
            MiniMap = reader.ReadUInt16();
            Light = (LightSetting)reader.ReadByte();

            BigMap = reader.ReadUInt16();

            int count = reader.ReadInt32();
            for (int i = 0; i < count; i++) {
                SafeZones.Add(new SafeZoneInfo(reader) { Info = this });
            }

            count = reader.ReadInt32();
            for (int i = 0; i < count; i++) {
                Respawns.Add(new RespawnInfo(reader, Envir.LoadVersion, Envir.LoadCustomVersion));
            }

            count = reader.ReadInt32();
            for (int i = 0; i < count; i++) {
                Movements.Add(new MovementInfo(reader));
            }

            NoTeleport = reader.ReadBoolean();
            NoReconnect = reader.ReadBoolean();
            NoReconnectMap = reader.ReadString();

            NoRandom = reader.ReadBoolean();
            NoEscape = reader.ReadBoolean();
            NoRecall = reader.ReadBoolean();
            NoDrug = reader.ReadBoolean();
            NoPosition = reader.ReadBoolean();
            NoThrowItem = reader.ReadBoolean();
            NoDropPlayer = reader.ReadBoolean();
            NoDropMonster = reader.ReadBoolean();
            NoNames = reader.ReadBoolean();
            Fight = reader.ReadBoolean();
            Fire = reader.ReadBoolean();
            FireDamage = reader.ReadInt32();
            Lightning = reader.ReadBoolean();
            LightningDamage = reader.ReadInt32();
            MapDarkLight = reader.ReadByte();
            count = reader.ReadInt32();
            for (int i = 0; i < count; i++) {
                MineZones.Add(new MineZone(reader));
            }

            MineIndex = reader.ReadByte();
            NoMount = reader.ReadBoolean();
            NeedBridle = reader.ReadBoolean();
            NoFight = reader.ReadBoolean();
            Music = reader.ReadUInt16();

            if(Envir.LoadVersion < 78) {
                return;
            }

            NoTownTeleport = reader.ReadBoolean();
            if(Envir.LoadVersion < 79) {
                return;
            }

            NoReincarnation = reader.ReadBoolean();

            if(Envir.LoadVersion >= 110) {
                WeatherParticles = (WeatherSetting)reader.ReadUInt16();
            }
        }

        public void Save(BinaryWriter writer) {
            writer.Write(Index);
            writer.Write(FileName);
            writer.Write(Title);
            writer.Write(MiniMap);
            writer.Write((byte)Light);
            writer.Write(BigMap);
            writer.Write(SafeZones.Count);

            for (int i = 0; i < SafeZones.Count; i++) {
                SafeZones[i].Save(writer);
            }

            writer.Write(Respawns.Count);
            for (int i = 0; i < Respawns.Count; i++) {
                Respawns[i].Save(writer);
            }

            writer.Write(Movements.Count);
            for (int i = 0; i < Movements.Count; i++) {
                Movements[i].Save(writer);
            }

            writer.Write(NoTeleport);
            writer.Write(NoReconnect);
            writer.Write(NoReconnectMap);
            writer.Write(NoRandom);
            writer.Write(NoEscape);
            writer.Write(NoRecall);
            writer.Write(NoDrug);
            writer.Write(NoPosition);
            writer.Write(NoThrowItem);
            writer.Write(NoDropPlayer);
            writer.Write(NoDropMonster);
            writer.Write(NoNames);
            writer.Write(Fight);
            writer.Write(Fire);
            writer.Write(FireDamage);
            writer.Write(Lightning);
            writer.Write(LightningDamage);
            writer.Write(MapDarkLight);
            writer.Write(MineZones.Count);
            for (int i = 0; i < MineZones.Count; i++) {
                MineZones[i].Save(writer);
            }

            writer.Write(MineIndex);

            writer.Write(NoMount);
            writer.Write(NeedBridle);

            writer.Write(NoFight);

            writer.Write(Music);
            writer.Write(NoTownTeleport);
            writer.Write(NoReincarnation);

            writer.Write((UInt16)WeatherParticles);
        }


        public void CreateMap() {
            for (int j = 0; j < Envir.NpcInfoList.Count; j++) {
                if(Envir.NpcInfoList[j].MapIndex != Index) {
                    continue;
                }

                Npcs.Add(Envir.NpcInfoList[j]);
            }

            Map map = new(this);

            if(!map.Load()) {
                return;
            }

            Envir.MapList.Add(map);

            for (int i = 0; i < SafeZones.Count; i++) {
                if(SafeZones[i].StartPoint) {
                    Envir.StartPoints.Add(SafeZones[i]);
                }
            }
        }

        public void CreateSafeZone() {
            SafeZones.Add(new SafeZoneInfo { Info = this });
        }

        public void CreateRespawnInfo() {
            Respawns.Add(new RespawnInfo { RespawnIndex = ++EditEnvir.RespawnIndex });
        }

        public override string ToString() {
            return string.Format("{0}: {1}", Index, Title);
        }

        public void CreateNpcInfo() {
            Npcs.Add(new NpcInfo());
        }

        public void CreateMovementInfo() {
            Movements.Add(new MovementInfo());
        }

        public static void FromText(string text) {
            string[] data = text.Split(new[] { ',' }, StringSplitOptions.RemoveEmptyEntries);

            if(data.Length < 8) {
                return;
            }

            MapInfo info = new() { FileName = data[0], Title = data[1] };


            if(!ushort.TryParse(data[2], out info.MiniMap)) {
                return;
            }

            if(!Enum.TryParse(data[3], out info.Light)) {
                return;
            }

            int sziCount, miCount, riCount, npcCount;

            if(!int.TryParse(data[4], out sziCount)) {
                return;
            }

            if(!int.TryParse(data[5], out miCount)) {
                return;
            }

            if(!int.TryParse(data[6], out riCount)) {
                return;
            }

            if(!int.TryParse(data[7], out npcCount)) {
                return;
            }


            int start = 8;

            for (int i = 0; i < sziCount; i++) {
                SafeZoneInfo temp = new() { Info = info };
                int x, y;

                if(!int.TryParse(data[start + (i * 4)], out x)) {
                    return;
                }

                if(!int.TryParse(data[start + 1 + (i * 4)], out y)) {
                    return;
                }

                if(!ushort.TryParse(data[start + 2 + (i * 4)], out temp.Size)) {
                    return;
                }

                if(!bool.TryParse(data[start + 3 + (i * 4)], out temp.StartPoint)) {
                    return;
                }

                temp.Location = new Point(x, y);
                info.SafeZones.Add(temp);
            }

            start += sziCount * 4;


            for (int i = 0; i < miCount; i++) {
                MovementInfo temp = new();
                int x, y;

                if(!int.TryParse(data[start + (i * 5)], out x)) {
                    return;
                }

                if(!int.TryParse(data[start + 1 + (i * 5)], out y)) {
                    return;
                }

                temp.Source = new Point(x, y);

                if(!int.TryParse(data[start + 2 + (i * 5)], out temp.MapIndex)) {
                    return;
                }

                if(!int.TryParse(data[start + 3 + (i * 5)], out x)) {
                    return;
                }

                if(!int.TryParse(data[start + 4 + (i * 5)], out y)) {
                    return;
                }

                temp.Destination = new Point(x, y);

                info.Movements.Add(temp);
            }

            start += miCount * 5;


            for (int i = 0; i < riCount; i++) {
                RespawnInfo temp = new();
                int x, y;

                if(!int.TryParse(data[start + (i * 7)], out temp.MonsterIndex)) {
                    return;
                }

                if(!int.TryParse(data[start + 1 + (i * 7)], out x)) {
                    return;
                }

                if(!int.TryParse(data[start + 2 + (i * 7)], out y)) {
                    return;
                }

                temp.Location = new Point(x, y);

                if(!ushort.TryParse(data[start + 3 + (i * 7)], out temp.Count)) {
                    return;
                }

                if(!ushort.TryParse(data[start + 4 + (i * 7)], out temp.Spread)) {
                    return;
                }

                if(!ushort.TryParse(data[start + 5 + (i * 7)], out temp.Delay)) {
                    return;
                }

                if(!byte.TryParse(data[start + 6 + (i * 7)], out temp.Direction)) {
                    return;
                }

                if(!int.TryParse(data[start + 7 + (i * 7)], out temp.RespawnIndex)) {
                    return;
                }

                if(!bool.TryParse(data[start + 8 + (i * 7)], out temp.SaveRespawnTime)) {
                    return;
                }

                if(!ushort.TryParse(data[start + 9 + (i * 7)], out temp.RespawnTicks)) {
                    return;
                }

                info.Respawns.Add(temp);
            }

            start += riCount * 7;


            for (int i = 0; i < npcCount; i++) {
                NpcInfo temp = new() { FileName = data[start + (i * 6)], Name = data[start + 1 + (i * 6)] };
                int x, y;

                if(!int.TryParse(data[start + 2 + (i * 6)], out x)) {
                    return;
                }

                if(!int.TryParse(data[start + 3 + (i * 6)], out y)) {
                    return;
                }

                temp.Location = new Point(x, y);

                if(!ushort.TryParse(data[start + 4 + (i * 6)], out temp.Rate)) {
                    return;
                }

                if(!ushort.TryParse(data[start + 5 + (i * 6)], out temp.Image)) {
                    return;
                }

                info.Npcs.Add(temp);
            }


            info.Index = ++EditEnvir.MapIndex;
            EditEnvir.MapInfoList.Add(info);
        }
    }
}
