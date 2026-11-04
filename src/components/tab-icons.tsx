import Svg, {G, Path} from "react-native-svg";
import { ColorValue } from "react-native";

type IconProps = {
    color?: ColorValue;
};

export function HomeIcon({ color }: IconProps){

    return (
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
            <G fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <Path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
                <Path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            </G>
        </Svg>
    );
}

export function StudyIcon({ color } : IconProps){
    return (
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
            <G fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <Path d="M12 5v16"></Path>
                <Path d="M20.001 19A2 2 0 0022 17V5a2 2 0 00-1.999-2L16 3.002A5 5 0 0012 5a5 5 0 00-4-2H4a2 2 0 00-2 2v12a2 2 0 001.999 2H8a5 5 0 014 2 5 5 0 014-2z"></Path>
            </G>
        </Svg>
    );
}

export function HistoryIcon({ color }: IconProps){
    return (
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
            <G fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <Path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></Path>
                <Path d="M3 3v5h5"></Path>
                <Path d="M12 7v5l4 2"></Path>
            </G>
        </Svg>
    )
}