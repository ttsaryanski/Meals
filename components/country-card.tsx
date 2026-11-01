import { Text, TouchableOpacity } from "react-native";

interface CountryCardProps {
    label?: string;
    onPress?: () => void;
    focused?: boolean;
    flag?: string;
}
const CountryCard = ({ label, onPress, focused, flag }: CountryCardProps) => {
    return (
        <>
            {flag ? (
                <TouchableOpacity
                    className={`w-content relative px-3 py-2`}
                    onPress={onPress}
                >
                    <Text
                        style={{
                            fontSize: focused ? 48 : 28,
                            includeFontPadding: true,
                        }}
                    >
                        {flag}
                    </Text>
                </TouchableOpacity>
            ) : (
                <TouchableOpacity
                    className={`w-content relative px-3 py-2 rounded-full ${focused ? "bg-light-200" : "bg-dark-100"}`}
                    onPress={onPress}
                >
                    <Text
                        className={`text-sm font-bold ${focused ? "text-dark-100" : "text-light-200"}`}
                        numberOfLines={1}
                    >
                        {label}
                    </Text>
                </TouchableOpacity>
            )}
        </>
    );
};

export default CountryCard;
