import clsx from "clsx";

interface SpinLoaderInterface {
    loaderVisible:boolean;
}

const SpinLoader = ({loaderVisible}:SpinLoaderInterface) => {
    return (
        <div
            className={clsx(`
                z-2 
                fixed
                w-full
                h-full
                opacity-80
                bg-base-300
            `,
            loaderVisible
            ?
            `
                visible
            `
            :
            `
                invisible
            `
        )} 
        style={{
            top: 0,
            left: 0
        }}  
        >
            <div
                className={clsx(`
                    absolute
                    border-16 
                    border-neutral-content
                    border-t-16
                    border-t-primary
                `)}
                style={{
                    width: "256px",
                    aspectRatio: "1/1",
                    borderRadius: "50%",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%,-50%)",
                    animation: "loader-spin 1s linear infinite",
                }}
            >
            </div>
        </div>
    );
}

export default SpinLoader;