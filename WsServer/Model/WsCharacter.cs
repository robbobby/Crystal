namespace WsServer.Model
{
    public class WsCharacter
    {
        public required int Id { get; set; }
        public required string Name { get; set; }
        public required int Level { get; set; }
        public required MirClass Class { get; set; }
        public required MirGender Gender { get; set; }
    }
}