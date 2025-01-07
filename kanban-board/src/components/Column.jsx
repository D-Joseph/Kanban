
import BoardItem from './BoardItem';
export default function Column({ name, items }) {
  return (
    <>
      <div>
        <h1 className="mt-4 text-lg text-center font-bold underline text-muiBlue">
          {name}
        </h1>
        <div className="grid grid-cols-1">
          {items.map((item) => (
            <BoardItem key={item.id} item={item}/>
          ))}
        </div>
      </div>
    </>
  );
}
