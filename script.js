gsap.to('.pp_startBtn',{scaleX:1.15,scaleY:1.15,duration:1,repeat:-1,yoyo:true});

document.querySelector('.pp_startBtn').addEventListener('click', function(){
  
gsap.timeline()
.to('.pp_startBtn',{opacity:0,display:'none',duration:.5})
.to('.pp_hand',{display:'block',opacity:1,duration:.5})
.fromTo('.pp_hand', {y:0},{y:-30,duration:.5,repeat:2,yoyo:true,ease: Linear.easeNone})
.to('.pp_hand',{display:'none',opacity:0,duration:.5},">")

  playing();
})








function playing(){
  shoot = false;
dragged = false;
minDis = 15;
overhead = 60;
missY = -175;
goalY = -135;
ballSize = .3;
shootDuration = .2;
bounceBaseY = -85;
goal = 0;
remainingBall = 3;

Draggable.create('.pp_ball_replica', {
  type: "x,y", edgeResistance: .99, cursor: 'auto', bounds: {
    top: 100, left: 50, width: 200, height: 135,
  },
  onDragEnd: function () {
    py = Math.abs(this.y);
    if (py <= minDis) {
      gsap.to(".pp_ball_replica", { duration: .1, x: 0, y: 0 });
    } else if (py < overhead && (!shoot)) {
      shoot = true;
      console.log('shooting...end');
      shootBall(this.x, py);
    }
    gsap.to(".pp_ball_replica", { duration: .1, x: 0, y: 0 });


  },

  onDrag: function () {
    py = Math.abs(this.y);
    if (py > minDis && py < overhead && (!dragged)) {
      dragged = true;
      dragInterval = setInterval(() => {
        if (!shoot) {
          console.log('shooting...ondrag');
          shootBall(this.x, py);

          shoot = true;
        }
      }, 400);
    }
    // up: for drag shot

    if (py > overhead && (!shoot)) {
      shoot = true;
      console.log('shooting...max');
      shootBall(this.x, py);

    }
  }
})

keeper = document.querySelector('.pp_keeper')
ball = document.querySelector('.pp_ball')


function shootBall(checkX, checkY) {
  lastX = checkX * 1.722;
  clearInterval(dragInterval);
  gsap.set('.pp_shadow', { display: 'none' });
  gsap.set('.pp_ball_replica', { display: 'none' });

  if (checkY > minDis && checkY < overhead) {
    lastY = goalY;
  } else {
    lastY = missY;
  }


  gsap.to(".pp_ball", {
    y: lastY, x: lastX, scaleX: ballSize, scaleY: ballSize, duration: shootDuration, ease: Linear.easeNone,
    onComplete: function () {

      var keeperRect = keeper.getBoundingClientRect();
      console.log("keeper: ", keeperRect.left);
      var ballRect = ball.getBoundingClientRect();
      console.log("ball: ", ballRect.left);

      if (lastY == -175) {
        document.querySelector('.pp_goal_text').innerText = 'Missed';
        // goal--;
        ballReduce();
      }
      else if (ballRect.left < 72 || ballRect.left > 226) {
        console.log('missAnimation side');
        document.querySelector('.pp_goal_text').innerText = 'Missed';
        // goal--;
        ballReduce();

      } else if ((keeperRect.left - 10) <= ballRect.left && (keeperRect.left + 40) >= ballRect.left) {
        console.log('saved');
        document.querySelector('.pp_goal_text').innerText = 'Blocked';
        // goal--;
        ballReduce();

      } else {
        document.querySelector('.pp_goal_text').innerText = 'Goal';
        goal++;
      }
      goalAnimation();
      document.getElementById('pp_score').innerText = goal;


      bounceBall(lastX, lastY);
      // clearBall();
    }
  });
}
function goalAnimation() {
  gsap.fromTo('.pp_goal_text', { delay: .3, display: 'none', opacity: 0, scale: .5 }, { display: 'flex', opacity: 1, scale: 1, duration: .5 });
  gsap.set('.pp_goal_state', { display: 'flex' });
  gsap.to('.pp_goal_text', { delay: 1, display: 'none', opacity: 0, scale: .5, duration: .3 });
}


function clearBall() {
  if (remainingBall > 0) {
    setTimeout(() => {
      gsap.to(".pp_ball", { opacity: 1, y: 0, x: 0, scaleX: 1, scaleY: 1, duration: .001 });
      gsap.set('.pp_shadow', { display: 'block', x: 0, y: 0 });
      gsap.set('.pp_ball_replica', { display: 'block', x: 0, y: 0 });
      shoot = false;
      dragged = false;
    }, 600);
  } else {
    console.log('ball empty');
    gsap.fromTo('.pp_finalScore', { delay: .3, display: 'none', opacity: 0, scale: .5 }, { display: 'flex', opacity: 1, scale: 1, duration: .5 });
    document.getElementById('finalScore').innerText = goal;

  }

}





function bounceBall(posX, posY) {
  console.log('baseLine:', posX, posY);
  difference = posY - bounceBaseY;

  if (posX > 25) {
    moveX = [30, 50, 70, 90, 110];
  } else if (posX < -25) {
    moveX = [-30, -50, -70, -90, -110];
  } else if (posX < 0) {
    moveX = [-20, -30, -40, -50, -60];
  } else if (posX >= 0) {
    moveX = [20, 30, 40, 50, 60];
  }

  gsap.timeline({ defaults: { ease: Linear.easeNone }, onComplete: clearBall })
    .to(".pp_ball", { delay: .01, opacity: 1, y: bounceBaseY, x: posX + moveX[0], duration: .2 })

    .to(".pp_ball", { opacity: 1, y: bounceBaseY + (difference / 1.5), x: posX + moveX[1], duration: .15 }, ">")

    .to(".pp_ball", { opacity: .8, y: bounceBaseY, x: posX + moveX[2], duration: .15 }, ">")

    .to(".pp_ball", { opacity: .5, y: bounceBaseY + (difference / 3), x: posX + moveX[3], duration: .15 }, ">")

    .to(".pp_ball", { opacity: 0.2, y: bounceBaseY, x: posX + moveX[4], duration: .15 }, ">");
}

manAnimation(.25);
function manAnimation(moveDuration) {
  gsap.timeline({ repeat: -1, yoyo: true, defaults: { ease: Linear.easeNone } })
    .to('.pp_keeper', { x: 50, duration: moveDuration })
    .to('.pp_keeper', { x: -50, duration: 2 * moveDuration })
    .to('.pp_keeper', { x: 50, duration: 2 * moveDuration })
    .to('.pp_keeper', { x: -50, duration: 2 * moveDuration })
    .to('.pp_keeper', { x: 0, duration: moveDuration })

}

function ballReduce() {
  document.getElementById('ball_' + remainingBall).style.display = 'none';
  remainingBall--;
}
}