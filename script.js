Draggable.create('.pp_ball_replica', {
  type: "xy", edgeResistance: .99,cursor: 'auto', bounds: {
      top: 100, left: 50, width: 200, height: 135,
  }, 
  // onDragEnd: function () {
  //     if (hitStatus) {
  //         gsap.to(".element_4", { display: "block", opacity: 1, duration: .5 });
  //         gsap.to(".element_6", { duration:.8, x: 0, y: 0});
  //     }
  // }, 
  // onDrag: function () {
  //     if (this.hitTest(".element_5", 55) && hitStatus) {
  //         hitStatus = false;
  //         console.log('hitted');
  //         hitHair();
  //     }
  // },
  // onDragStart: function () {
  //     gsap.to(".element_4", { display: "none", opacity: 0, duration: .5 });
  // }
})