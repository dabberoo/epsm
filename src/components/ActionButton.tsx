import clsx from "clsx";

interface ActionButtonInterface {
    actionCallback:() => void;
    mainText:string;
    subText?:string;
    textSize?:string;
    borderCol:string;
}

const ActionButton = ({actionCallback, mainText, subText, textSize, borderCol}:ActionButtonInterface) => {

    return (
        <div
            className={clsx(`
                w-40
                h-25
                m-2
                bg-base-300
                hover:bg-base-100
                border-4
                border-${borderCol} 
                rounded-box
                hover:border-accent
                opacity-80
                hover:opacity-100
                active:opacity-100
                active:border-success
                select-none
                cursor-pointer
                flex
                flex-col
                justify-center
            `)} 
            onClick={(ev) => {
              
                actionCallback();
            }}
        >
            <p className={clsx(`font-bold ${(textSize) ? `text-${textSize}` : "text-xl"}`)}>{mainText}</p>
            <p className="text-base text-info">{(subText && subText.length > 0) ? `(${subText})` : ""}</p>
        </div>
    )
}

export default ActionButton;