import { Link } from "expo-router";
import { Text, TouchableOpacity } from "react-native";

import { Image } from "@/utils/expo-image";

type MealCardProps = Meal & {
    onPress?: () => void;
};
const MealCard = ({
    idMeal,
    strMealThumb,
    strMeal,
    onPress,
}: MealCardProps) => {
    return (
        <Link href={`/meals/${idMeal}`} asChild onPress={onPress}>
            <TouchableOpacity className="w-[45%]">
                <Image
                    source={
                        strMealThumb
                            ? strMealThumb
                            : "https://placehold.co/500x400/0F0D23/A8B5DB.png"
                    }
                    className="w-full h-52 rounded-lg bg-[#0F0D23]"
                    contentFit="cover"
                    cachePolicy="memory-disk"
                    recyclingKey={idMeal}
                />

                <Text
                    className="text-sm font-bold text-light-200 my-2"
                    numberOfLines={1}
                >
                    {strMeal}
                </Text>
            </TouchableOpacity>
        </Link>
    );
};

export default MealCard;
