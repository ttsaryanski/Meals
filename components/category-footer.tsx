import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useEffect } from "react";
import {
    ActivityIndicator,
    Pressable,
    ScrollView,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import useFetch from "@/hooks/useFetch";
import { mealServices } from "@/services/mealServices";

import { Image } from "@/utils/expo-image";

interface FooterProps {
    category: string;
    isLandscape: boolean;
}
const CategoryFooter = ({ category, isLandscape }: FooterProps) => {
    const { data, loading, error, refetch } = useFetch(
        () => mealServices.listCategories(),
        false,
    );

    useEffect(() => {
        refetch();
    }, [category, refetch]);

    const details = data?.categories?.find(
        (item: Category) => item.strCategory === category,
    );

    if (loading && !details)
        return (
            <SafeAreaView className="bg-primary flex-1">
                <ActivityIndicator />
            </SafeAreaView>
        );

    if (!loading && !error && !details) {
        return (
            <SafeAreaView className="flex-1 items-center justify-center bg-primary px-5">
                <Text className="text-center text-light-200">
                    Category not found.
                </Text>
            </SafeAreaView>
        );
    }

    return (
        <View className="px-2">
            <ScrollView>
                {loading ? (
                    <ActivityIndicator
                        size="large"
                        color="#0000ff"
                        className="mt-10 self-center"
                    />
                ) : error && !details ? (
                    <Text className="text-red-800 text-center mt-10">
                        Error: {error?.message}
                    </Text>
                ) : (
                    <View>
                        <View className="relative flex-row items-center justify-start my-5">
                            <Link
                                href={{
                                    pathname: "/categories/[category]",
                                    params: { category },
                                }}
                                asChild
                            >
                                <Pressable className="flex-row items-center justify-between w-full">
                                    <Text className="text-lg text-light-200 font-bold py-3">
                                        View Meals with
                                    </Text>

                                    <Ionicons
                                        name="caret-forward-sharp"
                                        size={24}
                                        color="#A8B5DB"
                                    />
                                </Pressable>
                            </Link>
                        </View>

                        <Image
                            source={{
                                uri: `${details?.strCategoryThumb}`,
                            }}
                            className={`self-center ${!isLandscape ? "w-full" : "w-[400px]"} h-[400px]`}
                            contentFit="contain"
                            transition={200}
                            cachePolicy="memory-disk"
                            alt={`${category} image`}
                        />

                        <Text className="text-light-200 font-bold text-2xl">
                            {category}
                        </Text>

                        <MealInfo
                            label="Overview"
                            value={details?.strCategoryDescription}
                        />
                    </View>
                )}
            </ScrollView>
        </View>
    );
};

export default CategoryFooter;

const MealInfo = ({ label, value }: MealInfoProps) => (
    <View className="flex-col items-start justify-center mt-5">
        <Text className="text-light-200 font-normal text-sm">{label}</Text>
        <Text className="text-light-200 font-bold text-sm mt-2">
            {value || "N/A"}
        </Text>
    </View>
);
