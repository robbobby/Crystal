namespace Server
{
    public class ObservableCountList<T> : List<T>
    {
        public event Action<int> OnListChange;

        public new void Add(T item)
        {
            base.Add(item);
            OnListChange?.Invoke(Count);
        }

        public new void Remove(T item)
        {
            base.Remove(item);
            OnListChange?.Invoke(Count);
        }

        public new void Clear()
        {
            base.Clear();
            OnListChange?.Invoke(Count);
        }
    }
}