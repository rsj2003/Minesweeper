window.onload = function() {
  const $reset = document.getElementById("reset");
  const $lineCount = document.getElementById("lineCount");
  const $difficulty = document.getElementById("difficulty");
  const $game = document.getElementById("game");
  const $count = document.getElementById("count");
  const $mineLength = document.getElementById("mineLength");
  const $playTime = document.getElementById("playTime");
  let $mine;
  let $li = document.querySelectorAll(".line>li");
  let difficulty = 1;
  let lineCount = 5;
  let firstClick = true;
  let timer = 0;
  let timerInterval;
  reset();

  document.addEventListener("contextmenu", e => {
    e.preventDefault();
    return false;
  });

  $reset.addEventListener("click", reset);

  document.addEventListener("keydown", e => {
    if(e.key === "Enter") {
      $li.forEach(i => {
        if(!hasClass(i, "mine")) i.classList.remove("hidden");
      })
      firstClick = false;
    }
  })

  function liCickEvent() {
    $li.forEach((l,i) => {
      // l.classList.add("hidden");
      l.addEventListener("mousedown", e => {
        if(e.button === 0) {
          if(hasClass(e.target, "flag")) return false;
          if(firstClick === true) {
            moveMine(i)
            firstClick = false;
            setTimer();
          };
          if(hasClass(e.target, "mine")) {
            if(confirm("다시 시작하시겠습니까?") === true) return reset();
            clearInterval(timerInterval);
            $playTime.classList.add("fail");
          };
          deleteHidden(i);
        }
        if(e.button === 2) {
          if(hasClass(e.target, "hidden")) e.target.classList.toggle("flag");
          $mineLength.innerHTML = document.querySelectorAll(".flag").length;
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
      if(!hasClass($li[idx], "mine")){
        $li[idx].classList.add("mine");
        pushWarning(idx);
      }else {
        i--;
      };
    };
    $mine = document.querySelectorAll(".mine");
    $count.innerHTML = $mine.length;
    firstClick = true;
  };
  
  function deleteHidden(i) {
    if(i < 0 || i >= lineCount * lineCount) return false;
    if(!hasClass($li[i], "hidden") || hasClass($li[i], "mine")) return false;
    $li[i].classList.remove("flag");
    $li[i].classList.remove("hidden");
    if(hasClass($li[i], "warning")) return false;
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
        if(hasClass($li[l], "mine")) {
          $li[l].classList.remove("mine");  
          splitWarning(l);
          let clear = true;
          while(clear) {
            let idx = Math.floor(Math.random() * $li.length);
            if(around.indexOf(idx) === -1 && !hasClass($li[idx], "mine")){
              $li[idx].classList.add("mine");
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
    if(!hasClass($li[i], "warning")) {
      $li[i].classList.add("warning");
      $li[i].querySelector(".warningNumber").innerHTML = "1";
    }else {
      $li[i].querySelector(".warningNumber").innerHTML = Number($li[i].querySelector(".warningNumber").innerHTML) + 1;
    }
    if(hasClass($li[i], "mine")) $li[i].classList.add("warning");
  }

  function removeWarning(i) {
    if(i < 0 || i >= lineCount * lineCount) return false;
    let mineCount = Number($li[i].querySelector(".warningNumber").innerHTML) - 1;
    if(mineCount === 0) {
      $li[i].classList.remove("warning");
      $li[i].querySelector(".warningNumber").innerHTML = "";
      return;
    };
    $li[i].querySelector(".warningNumber").innerHTML = mineCount;
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
      line += `<li class="hidden"><span class="warningNumber"></span><span class="before"></span><span class="after"></span></li>`;
    };
    line += `</ul></li>`;
    for(let i = 0; i < lineCount; i++) {
      html += line;
    };
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
    let finish = true;
    $li.forEach(i => {
      if(hasClass(i, "mine") && !hasClass(i, "flag")) return finish = false;
      if(!hasClass(i, "mine") && hasClass(i, "hidden")) return finish = false;
    })
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
};