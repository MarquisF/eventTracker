(() => {
  const getTimeMinuteSecond = time => {
    const date = new Date(time);
    const h = date.getHours();
    let minute = date.getMinutes();
    const s = date.getSeconds();
    const ms = date.getMilliseconds();
    if ( minute.toString().length === 1 ) {
      minute = `0${minute}`
    }
    return `${h}:${minute} ${s}.${ms}s`;
  }

  const getApproximateTime = time => {
    const date = new Date(time);
    const month = date.getMonth();
    const theDate = date.getDate()
    const day = date.getDay();
    const h = date.getHours();
    let minute = date.getMinutes();
    const s = date.getSeconds();
    const ms = date.getMilliseconds();

    if ( minute.toString().length === 1 ) {
      minute = `0${minute}`
    }

    return `${month + 1}-${theDate} ${h}:${minute}`;
  }

  window.appUtils = {
    getTimeMinuteSecond,
    getApproximateTime
  }
})()