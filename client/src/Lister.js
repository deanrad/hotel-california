import React, { useState, useEffect } from "react";
import { interval } from "rxjs";
import { scan, take, map } from "rxjs/operators";

function useObservable(o) {
  const [list, setList] = useState([]);

  const sub = o.subscribe(next => setList(next));
  return list;
}

// return a new Observable not returning props,
// just the list itself
function getO() {
  return interval(1000).pipe(
    take(5),
    scan((all, i) => {
      return [...all, i];
    }, [])
  );
}
const o = getO();

const Lister = () => {
  const list = useObservable(o);

  return (
    <ol>
      {list.map((i, idx) => (
        <li key={idx}>{i}</li>
      ))}
    </ol>
  );
};

export default Lister;
