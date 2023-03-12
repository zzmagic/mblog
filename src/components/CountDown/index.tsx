import { useEffect, useState } from "react";
import styles from './index.module.scss'

interface IProps {
    time: number;
    onEnd: Function
}

const CountDown = (props: IProps) => {
    const {time, onEnd} = props;
    const [count, setCount] = useState(time || 60);

    useEffect(() => {
        const id = setInterval(() => {
            setCount((count) => {
                if (count === 1) {
                    clearInterval(id);
                    onEnd && onEnd();
                    return count;
                }
                return count - 1;
            });
        }, 1000);
        return () => {
            clearInterval(id);
        }
    }, [time, onEnd]);

    // setInterval(() => {
    //     setCount((count) => {
    //         if (count === 1) {
    //             onEnd && onEnd();
    //             return count;
    //         }
    //         return count - 1;
    //     });
    // }, 1000);


    return (<div className={styles.countDown}>{count} s</div>);
}

export default CountDown