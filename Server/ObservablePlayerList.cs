using Server.MirObjects;

namespace Server
{
    public class ObservablePlayerList : List<PlayerObject>
    {
        public event Action<int> OnListChange;
        public event Action<PlayerObject> OnPlayerAdded;
        public event Action<PlayerObject> OnPlayerRemoved;

        public new void Add(PlayerObject item)
        {
            base.Add(item);
            OnListChange?.Invoke(Count);
            OnPlayerAdded?.Invoke(item);
        }

        public new void Remove(PlayerObject item)
        {
            base.Remove(item);
            OnListChange?.Invoke(Count);
            OnPlayerRemoved?.Invoke(item);
        }

        public new void Clear()
        {
            base.Clear();
            OnListChange?.Invoke(Count);
        }
    }
}