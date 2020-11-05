window.onload = function() {
  const $reset = document.getElementById("reset");
  const $lineCount = document.getElementById("lineCount");
  const $difficulty = document.getElementById("difficulty");
  const $game = document.getElementById("game");
  const $count = document.getElementById("count");
  const $mineLength = document.getElementById("mineLength");
  const $playTime = document.getElementById("playTime");
  let $li = document.querySelectorAll(".line>li");
  let difficulty = 1;
  let lineCount = 5;
  let firstClick = true;
  let timer = 0;
  let timerInterval;
  let warningList = new Array();
  let mineList = new Array();
  let flagList = new Array();
  finish = false;
  reset();

  document.addEventListener("contextmenu", e => {
    e.preventDefault();
    return false;
  });

  $reset.addEventListener("click", reset);

  document.addEventListener("keydown", e => {
    if(e.key === "h") {
      $li.forEach((e, i) => {
        if(mineList[i] === 0) {
          if(warningList[i] > 0) e.querySelector(".warningCount").innerHTML = warningList[i];
          flagList[i] = 0;
          $li[i].classList.remove("flag");
          e.classList.remove("hidden");
        }
      })
      $mineLength.innerHTML = arrayCount(flagList, 1);
      finishTest();
      firstClick = false;
    }
    if(e.key === "m") {
      mineList.forEach((e, i) => {
        if(e === 1) {
          flagList[i] = 1;
          $li[i].classList.add("flag");
        }
      });
      $mineLength.innerHTML = arrayCount(flagList, 1);
      finishTest();
      firstClick = false;
    }
  })

  function liCickEvent() {
    $li.forEach((l,i) => {
      l.addEventListener("mousedown", e => {
        if(finish) return false;
        if(e.button === 0) {
          if(flagList[i] === 1) return false;
          if(firstClick === true) {
            moveMine(i)
            firstClick = false;
            setTimer();
          };
          if(mineList[i] === 1) {
            if(confirm("다시 시작하시겠습니까?") === true) return reset();
            clearInterval(timerInterval);
            $playTime.classList.add("fail");
          };
          deleteHidden(i);
        }
        if(e.button === 2) {
          if(hasClass(e.target, "hidden")) {
            e.target.classList.toggle("flag");
            if(hasClass(e.target, "flag")) {
              flagList[i] = 1;
            }else {
              flagList[i] = 0;
            }
          }
          $mineLength.innerHTML = arrayCount(flagList, 1);
        }
        finishTest();
      })
      l.addEventListener("dblclick", e => {
        if((i + 1) % lineCount !== 0) {
          liDblclick(i - lineCount + 1);
          liDblclick(i + 1);
          liDblclick(i + lineCount + 1);
        };
        if((i + 1) % lineCount !== 1) {
          liDblclick(i - lineCount - 1);
          liDblclick(i - 1);
          liDblclick(i + lineCount - 1);
        }
        liDblclick(i - lineCount);
        liDblclick(i + lineCount);
        liDblclick(i);
      })
    }); 
    for(let i = 0; i < ($li.length / (15 - difficulty)) + difficulty; i++) {
      let idx = Math.floor(Math.random() * $li.length);
      if(mineList[idx] === 0){
        mineList[idx] = 1;
        pushWarning(idx);
      }else {
        i--;
      };
    };
    $count.innerHTML = arrayCount(mineList, 1);
    firstClick = true;
  };
  
  function deleteHidden(i) {
    if(i < 0 || i >= lineCount * lineCount) return false;
    if(!hasClass($li[i], "hidden") || mineList[i] === 1) return false;
    $li[i].classList.remove("flag");
    flagList[i] = 0;
    $li[i].classList.remove("hidden");
    $mineLength.innerHTML = arrayCount(flagList, 1);
    if(warningList[i] > 0) {
      $li[i].querySelector(".warningCount").innerHTML = `${warningList[i]}`;
      return false;
    }
    if((i + 1) % lineCount !== 0) {
      deleteHidden(i - lineCount + 1);
      deleteHidden(i + 1);
      deleteHidden(i + lineCount + 1);
    };
    if((i + 1) % lineCount !== 1) {
      deleteHidden(i - lineCount - 1);
      deleteHidden(i - 1);
      deleteHidden(i + lineCount - 1);
    }
    deleteHidden(i - lineCount);
    deleteHidden(i + lineCount);
  }

  function pushWarning(i) {
    if((i + 1) % lineCount !== 0) {
      setWarning(i - lineCount + 1);
      setWarning(i + 1);
      setWarning(i + lineCount + 1);
    };
    if((i + 1) % lineCount !== 1) {
      setWarning(i - lineCount - 1);
      setWarning(i - 1);
      setWarning(i + lineCount - 1);
    }
    setWarning(i - lineCount);
    setWarning(i + lineCount);
  }

  function splitWarning(i) {
    if((i + 1) % lineCount !== 0) {
      removeWarning(i - lineCount + 1);
      removeWarning(i + 1);
      removeWarning(i + lineCount + 1);
    };
    if((i + 1) % lineCount !== 1) {
      removeWarning(i - lineCount - 1);
      removeWarning(i - 1);
      removeWarning(i + lineCount - 1);
    }
    removeWarning(i - lineCount);
    removeWarning(i + lineCount);
  }

  function moveMine(i) {
    let around = new Array();
    if(difficulty <= 5) {
      around = [i, i - lineCount, i + lineCount];
      if((i + 1) % lineCount !== 0) {
        around.push(i - lineCount + 1);
        around.push(i + 1);
        around.push(i + lineCount + 1);
      };
      if((i + 1) % lineCount !== 1) {
        around.push(i - lineCount - 1);
        around.push(i - 1);
        around.push(i + lineCount - 1);
      }
    }else {
      around = [i];
    }
    around.forEach(l => {
      if(l >= 0 && l < lineCount * lineCount) {
        if(mineList[l] === 1) {
          mineList[l] = 0;
          splitWarning(l);
          let clear = true;
          while(clear) {
            let idx = Math.floor(Math.random() * mineList.length);
            if(around.indexOf(idx) === -1 && mineList[idx] === 0){
              mineList[idx] = 1;
              pushWarning(idx);
              clear = false;
            }
          }
        }
      }
    })
  }

  function setWarning(i) {
    if(i < 0 || i >= lineCount * lineCount) return false;
    warningList[i]++;
  }

  function removeWarning(i) {
    if(i < 0 || i >= lineCount * lineCount) return false;
    warningList[i]--;
  }

  function liDblclick(i) {
    if(i < 0 || i >= lineCount * lineCount) return false;
    $li[i].classList.add("highlight");
    setTimeout(e => {
      $li[i].classList.remove("highlight");
    },0);
  }

  function reset() {
    let html = "";
    lineCount = Number($lineCount.value);
    difficulty = Number($difficulty.value);
    warningList = new Array();
    mineList = new Array();
    flagList = new Array();
    if(lineCount > 30) {
      lineCount = 30;
      $lineCount.value = 30;
    }
    if(difficulty > 5) {
      difficulty = 5;
      $difficulty.value = 5;
    }
    let line = `<li><ul class="line">`;
    for(let i = 0; i < lineCount; i++) {
      line += `<li class="hidden"><span class="warningCount"></span><span class="before"></span><span class="after"></span></li>`;
    };
    line += `</ul></li>`;
    for(let i = 0; i < lineCount; i++) {
      html += line;
    };
    for(let i = 0; i < lineCount * lineCount; i++) {
      warningList.push(0);
      mineList.push(0);
      flagList.push(0);
    }
    $game.innerHTML = html;
    $li = document.querySelectorAll(".line>li");
    $mineLength.innerHTML = "0";
    $playTime.innerHTML = "00 : 00";
    $playTime.classList.remove("fail");
    $game.style.width = `${(lineCount * 31) + 1}px`;
    $game.style.height = `${(lineCount * 31) + 1}px`;
    clearInterval(timerInterval);
    liCickEvent();
  }

  function finishTest() {
    finish = true;
    for(let i = 0; i < mineList.length; i++) {
      if(mineList[i] !== flagList[i]) return finish = false;
      if(mineList[i] === 0 && hasClass($li[i], "hidden")) return finish = false;
    }
    if(finish) {
      clearInterval(timerInterval);
      alert("성공");
    }
  }

  function setTimer() {
    timer = 0;
    timerInterval = setInterval(e => {
      timer++;
      $playTime.innerHTML = `${fillZero(Math.floor(timer / 60), 2)} : ${fillZero(timer % 60, 2)}`;
    },1000)
  };

  
  function fillZero(n, width) {
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
}

  function hasClass(element, className) {
    return element.classList.contains(className);
  };

  function arrayCount(arr, str) {
    let idx = 0;
    for(let i = 0; i < arr.length; i++) {
      if(arr[i] === str) idx++;
    }
    return idx;
  }
};