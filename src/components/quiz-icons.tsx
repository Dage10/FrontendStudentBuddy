import Svg, { Path } from "react-native-svg";

export function CheckIcon(){
    return(
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
            <Path
                d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                stroke="#15803D"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
}

export function XIcon(){
    return(
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
            <Path
                d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                stroke="#B91C1C"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
}