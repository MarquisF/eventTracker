( async () => {
  const axios = window.axios;

  document.onclick = async event => {
    const target = event.target;
    const url = window.location.href;
    const elementId = target.id;
    console.log(target)
    const elementClassName = target.className;
    const x = event.clientX;
    const y = event.clientY;
    const req = {
      url,
      elementId,
      elementClassName,
      x,
      y
    };

    await axios.post('/api/event', req);
  }
})()