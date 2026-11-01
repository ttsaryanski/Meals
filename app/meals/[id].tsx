import { Link, useLocalSearchParams } from "expo-router";
import { ComponentRef, useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    Linking,
    Pressable,
    ScrollView,
    Share,
    Text,
    TouchableOpacity,
    useWindowDimensions,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import useFetch from "@/hooks/useFetch";
import { mealServices } from "@/services/mealServices";
import { Image } from "@/utils/expo-image";
import {
    extractIngredientNames,
    extractIngredients,
} from "@/utils/extractIngredients";
import {
    deleteLocalMeal,
    getLocalSavedMeals,
    saveLocalMeal,
} from "@/utils/storage";

import { AntDesign, Feather, Ionicons } from "@expo/vector-icons";

import { countries } from "@/constants/countries";
import { icons } from "@/constants/icons";

const Details = () => {
    const listRef = useRef<ComponentRef<typeof ScrollView>>(null);
    const { id } = useLocalSearchParams();
    const [isSaved, setIsSaved] = useState(false);
    const [showScrollToTop, setShowScrollToTop] = useState(false);
    const { width, height } = useWindowDimensions();
    const isLandscape = width > height;

    const { data, loading, error } = useFetch(async () => {
        const [detailsResponse, savedMeals] = await Promise.all([
            mealServices.getDetails(id as string),
            getLocalSavedMeals(),
        ]);

        const mealId = Number(id);
        return {
            detailsResponse,
            isSaved: savedMeals.some((meal) => meal.meal_id === mealId),
        };
    });

    useEffect(() => {
        if (data) {
            setIsSaved(data.isSaved);
        }
    }, [data]);

    const details: Meal | undefined = data?.detailsResponse.meals?.[0];
    const ingredients = details ? extractIngredients(details) : [];
    const countryFlag = countries.find(
        (item) => item.label === details?.strCountry,
    )?.flag;

    if (loading && !data)
        return (
            <SafeAreaView className="bg-primary flex-1">
                <ActivityIndicator />
            </SafeAreaView>
        );

    if (!loading && !error && !details) {
        return (
            <SafeAreaView className="flex-1 items-center justify-center bg-primary px-5">
                <Text className="text-center text-light-200">
                    Meal not found.
                </Text>
            </SafeAreaView>
        );
    }

    const openVideo = () => {
        if (details?.strYoutube) {
            Linking.openURL(details?.strYoutube);
        }
        return;
    };

    const onSave = async () => {
        if (!details) {
            return;
        }

        const mealId = Number(details.idMeal);

        if (isSaved) {
            await deleteLocalMeal(mealId);
            setIsSaved(false);
        } else {
            await saveLocalMeal({
                meal_id: mealId,
                title: details.strMeal,
                img_url: details.strMealThumb ?? "",
            });
            setIsSaved(true);
        }
    };

    const shareMeal = async () => {
        if (!details) return;
        try {
            const ingredientList = ingredients
                .map(({ name, measure }) =>
                    measure ? `  ${measure} - ${name}` : `  ${name}`,
                )
                .join("\n");

            await Share.share({
                message: [
                    details.strMeal,
                    `from ${details?.strCountry || "Unknown source"}`,
                    "Ingredients:",
                    ingredientList || "No ingredients listed.",
                    "Instructions:",
                    details?.strInstructions || "No instructions available.",
                    "Meals - A Delicious Journey",
                    "...",
                    // "https://play.google.com/store/apps/details?id=com.ttsaryanski.cocktails",
                ].join("\n\n"),
            });
        } catch (error) {
            console.error("Error sharing meal:", error);
        }
    };

    const handleScroll = (event: any) => {
        const offsetY = event.nativeEvent.contentOffset.y;

        setShowScrollToTop(offsetY > 400);
    };

    return (
        <View className={`flex-1 bg-primary ${isLandscape ? "px-16" : ""}`}>
            <ScrollView
                ref={listRef}
                onScroll={handleScroll}
                contentContainerStyle={{ paddingBottom: isLandscape ? 10 : 70 }}
            >
                {loading ? (
                    <ActivityIndicator
                        size="large"
                        color="#0000ff"
                        className="mt-10 self-center"
                    />
                ) : error && !data ? (
                    <Text className="text-red-800 text-center mt-10">
                        Error: {error?.message}
                    </Text>
                ) : (
                    <>
                        <View>
                            <Image
                                source={{
                                    uri: `${details?.strMealThumb}`,
                                }}
                                className={`self-center w-full aspect-square`}
                                contentFit="fill"
                                transition={200}
                                cachePolicy="memory-disk"
                            />

                            {details?.strYoutube && (
                                <TouchableOpacity
                                    onPress={openVideo}
                                    className="absolute bottom-5 right-5 rounded-full size-14 bg-light-500 flex items-center justify-center"
                                >
                                    <Image
                                        source={icons.play}
                                        className="w-6 h-7 ml-1"
                                        contentFit="fill"
                                    />
                                </TouchableOpacity>
                            )}

                            <TouchableOpacity
                                onPress={onSave}
                                className="absolute bottom-5 left-5 rounded-full size-14 bg-light-500 flex items-center justify-center"
                            >
                                <Image
                                    source={
                                        isSaved ? icons.saved : icons.unsaved
                                    }
                                    className="w-8 h-8"
                                    contentFit="fill"
                                />
                            </TouchableOpacity>
                        </View>

                        <View className="flex-col items-start justify-center mt-5 px-5">
                            <View className="flex-row items-center justify-between w-full">
                                <Text className="flex-1 mr-3 text-light-200 font-bold text-2xl">
                                    {details?.strMeal}
                                </Text>

                                <Pressable
                                    onPress={shareMeal}
                                    className="shrink-0 bg-light-500 rounded-full p-3"
                                >
                                    <Feather
                                        name="share-2"
                                        size={24}
                                        color="#221F3D"
                                    />
                                </Pressable>
                            </View>

                            <Link
                                href={`/categories/${details?.strCategory}`}
                                asChild
                            >
                                <Pressable className="flex-1 w-full flex-row items-center justify-between">
                                    <MealInfo
                                        label="Category"
                                        value={details?.strCategory}
                                    />

                                    <AntDesign
                                        style={{
                                            alignSelf: "flex-end",
                                            marginRight: 10,
                                        }}
                                        name="caret-right"
                                        size={24}
                                        color="#A8B5DB"
                                    />
                                </Pressable>
                            </Link>

                            <Link
                                href={`/explore/country?country=${details?.strCountry}`}
                                asChild
                            >
                                <Pressable className="flex-1 w-full flex-row items-center justify-between">
                                    <MealInfo
                                        label="Country"
                                        value={details?.strCountry}
                                        flag={countryFlag}
                                    />

                                    <AntDesign
                                        style={{
                                            alignSelf: "flex-end",
                                            marginRight: 10,
                                        }}
                                        name="caret-right"
                                        size={24}
                                        color="#A8B5DB"
                                    />
                                </Pressable>
                            </Link>

                            <Text className="text-light-200 font-normal text-base mt-5 mb-2">
                                Ingredients:
                            </Text>

                            {ingredients.map((ingredient, index) => (
                                <View
                                    key={index}
                                    className="flex w-full flex-row items-center gap-5"
                                >
                                    <View className="flex flex-col basis-1/2 gap-4">
                                        {ingredient.measure && (
                                            <Text className="text-light-200 font-normal text-base">
                                                {ingredient.measure}
                                            </Text>
                                        )}
                                        <Text className="text-light-200 font-bold text-base">
                                            {ingredient.name}
                                        </Text>
                                    </View>

                                    <Image
                                        source={{
                                            uri: `https://www.themealdb.com/images/ingredients/${extractIngredientNames(ingredient.name)}.png/small`,
                                        }}
                                        className="w-[100px] h-[100px] self-baseline-last"
                                        contentFit="none"
                                        transition={200}
                                        cachePolicy="memory-disk"
                                        alt={`${ingredient.name} image`}
                                    />
                                </View>
                            ))}

                            <MealInfo
                                label="Overview"
                                value={details?.strInstructions}
                            />
                        </View>
                    </>
                )}
            </ScrollView>

            {showScrollToTop && (
                <Pressable
                    onPress={() =>
                        listRef.current?.scrollTo({
                            y: 0,
                            animated: true,
                        })
                    }
                    className={`absolute ${isLandscape ? "right-16 bottom-8" : "right-5 bottom-32"} w-14 h-14 rounded-full bg-dark-100 items-center justify-center`}
                    style={{ elevation: 5 }}
                >
                    <Ionicons name="arrow-up" size={26} color="#A8B5DB" />
                </Pressable>
            )}
        </View>
    );
};

export default Details;

const MealInfo = ({ label, value, flag }: MealInfoProps) => (
    <View className="flex-col items-start justify-center mt-5">
        <Text className="text-light-200 font-normal text-base">{label}</Text>

        <View className="flex-row items-center mt-2">
            <Text className="text-light-200 font-bold text-base">
                {value || "N/A"}
            </Text>

            {flag ? (
                <Text
                    style={{
                        fontSize: 24,
                        marginLeft: 12,
                        includeFontPadding: true,
                    }}
                >
                    {flag}
                </Text>
            ) : null}
        </View>
    </View>
);
