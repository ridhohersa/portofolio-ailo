import {motion,useScroll,useSpring} from "motion/react";
export default function ScrollProgress(){
  const {scrollYProgress}=useScroll(),s=useSpring(scrollYProgress,{stiffness:120,damping:30});
  return <motion.div className="sprog" style={{scaleX:s}} aria-hidden="true"/>;
}
