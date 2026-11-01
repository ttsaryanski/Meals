import MaskedView from "@react-native-masked-view/masked-view";
import { Link } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

import { Image } from "@/utils/expo-image";

import { images } from "@/constants/images";

const CompatibleMaskedView = MaskedView as unknown as React.ComponentType<any>;

interface TrendingCardProps {
    meal: TrendingMeal;
    index: number;
}
const TrendingMealCard = ({
    meal: { meal_id, title, img_url },
    index,
}: TrendingCardProps) => {
    return (
        <Link href={`/meals/${meal_id}`} asChild>
            <TouchableOpacity className="w-32 relative pl-5">
                <Image
                    source={
                        img_url
                            ? img_url
                            : "https://placehold.co/400x400/0F0D23/A8B5DB.png"
                    }
                    className="w-32 h-48 rounded-lg bg-[#0F0D23]"
                    contentFit="cover"
                    cachePolicy="memory-disk"
                    recyclingKey={String(meal_id)}
                />

                <View className="absolute bottom-14 -left-3.5 px-3 py-1 rounded-full">
                    <CompatibleMaskedView
                        maskElement={
                            <Text
                                className="font-bold text-light-200 text-6xl"
                                allowFontScaling={false}
                            >
                                {index + 1}
                            </Text>
                        }
                    >
                        <Image
                            source={images.rankingGradient}
                            className="size-14"
                            contentFit="cover"
                        />
                    </CompatibleMaskedView>
                </View>

                <Text
                    className="text-sm font-bold mt-2 text-light-200"
                    numberOfLines={1}
                >
                    {title}
                </Text>
            </TouchableOpacity>
        </Link>
    );
};

export default TrendingMealCard;
