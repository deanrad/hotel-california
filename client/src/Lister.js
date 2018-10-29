import React, { useState, useEffect } from "react";
import { interval } from "rxjs";
import { scan, take } from "rxjs/operators";

function useObservable(o) {
  const [list, setList] = useState([]);

  useEffect(() => {
    const sub = o.subscribe(next => setList(next));

    return () => {
      // if we unsubscribe, we get only zero,
      // but if we don't we get weird flicker :(
      sub.unsubscribe();
    };
  });

  return list;
}

// return a new Observable
function getO() {
  return interval(1000).pipe(
    take(5),
    scan((all, i) => {
      return [...all, i];
    }, [])
  );
}

const o = getO();
export default () => {
  const list = useObservable(o);
  return (
    <ol>
      {list.map((i, idx) => (
        <li key={idx}>{i}</li>
      ))}
    </ol>
  );
};
