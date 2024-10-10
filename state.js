const state = JSON.stringify({
    page: '/project/123/edit',
    tempToken: 123
  });
  const encodedState = encodeURIComponent(state);
  console.log(encodedState)