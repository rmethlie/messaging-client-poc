
export function filterRoster(all, query) {
  const tests = Object.keys(query).map((key) => {
    const regex = new RegExp(`^${query[key]}|.\\s${query[key]}`, 'ig');
    return {key, regex};
  });
  return all.filter((item)=> {
    return tests.some(test => test.regex.test(item[test.key]));
  });
}

export default function quickSelectMiddleware({ dispatch, getState }) {
  return (next) => {
    return (action) => {
      switch (action.type) {
        case 'API.QUICKSELECT.SEARCH': {
          const id = action.data.id;
          // read the current roster
          const all = getState().roster.all;
          // make a copy for demo purposes
          // const results = all.slice(0, Math.min(all.length, 10));
          const results = filterRoster(all, action.data.query);
          // set the results
          next({
            type: 'QUICKSELECT.SET',
            data: {id, results}
          });
          break;
        }
        case 'API.QUICKSELECT.CLEAR': {
          const id = action.data.id;
          next({
            type: 'QUICKSELECT.SET',
            data: {id}
          });
          break;
        }
        default:
          next(action);
      }
    }
  }
}
