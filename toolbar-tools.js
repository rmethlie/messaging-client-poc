

function CycleLayout({ container, layouts, dispatch }) {
  const id = 'CYCLE_LAYOUT';
  let flowIndex = 0;
  const flows = [{
    label: String.fromCharCode(8617),
    value: 'row wrap'
  }, {
    label: String.fromCharCode(8595),
    value: 'column wrap'
  }];
  const label = flows[0].label;

  function getFlow() {
    return flows[flowIndex];
  }

  function getNextFlow() {
    flowIndex += 1;
    if (flowIndex === flows.length) {
      flowIndex = 0;
    }
    return getFlow();
  }

  function handler() {
    const nextFlow = getNextFlow();
    dispatch({
      type: 'SET_LAYOUT',
      data: {id, flow: nextFlow.value}
    });
  }

  return { id, label, title, handler };
}
