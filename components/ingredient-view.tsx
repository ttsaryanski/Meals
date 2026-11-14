import { useLocalSearchParams, useRouter, type Href } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Image,
    Pressable,
    RefreshControl,
    Text,
    useWindowDimensions,
    View,
} from "react-native";

import useFetch from "@/hooks/useFetch";
import { mealServices } from "@/services/mealServices";

import IngredientCard from "@/components/ingredient-card";

import { Ionicons } from "@expo/vector-icons";

import { alphabet } from "@/constants/alphabet";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";

const randomNumber = Math.random();

type IngredientViewProps = {
    showBackButton?: boolean;
    backRoute?: Href;
};

const IngredientView = ({
    showBackButton = true,
    backRoute = "/explore",
}: IngredientViewProps) => {
    const router = useRouter();
    const listRef = useRef<FlatList>(null);
    const letterListRef = useRef<FlatList>(null);
    const { ingredient } = useLocalSearchParams<{
        ingredient: string;
    }>();
    const [ingredients, setIngredients] = useState<Ingredients>({ meals: [] });
    const [showScrollToTop, setShowScrollToTop] = useState(false);
    const [selectedLetter, setSelectedLetter] = useState("A");
    const { width, height } = useWindowDimensions();
    const isLandscape = width > height;

    const {
        data: rawIngredients,
        loading,
        error,
        refetch,
    } = useFetch(() => mealServices.getIngredientList("i"));

    useEffect(() => {
        const meals = rawIngredients?.meals ?? [];
        const filteredMeals = ingredient
            ? meals.filter((item) => item.strIngredient === ingredient)
            : selectedLetter
              ? meals.filter((item) =>
                    item.strIngredient.toUpperCase().startsWith(selectedLetter),
                )
              : meals;

        setIngredients({ meals: filteredMeals });
    }, [selectedLetter, rawIngredients, ingredient]);

    const handleRefresh = async () => {
        await refetch();
    };

    const handleScroll = (event: any) => {
        const offsetY = event.nativeEvent.contentOffset.y;

        setShowScrollToTop(offsetY > 400);
    };

    const handleLetterFilter = async (letter: string) => {
        setSelectedLetter(letter);
    };

    const LETTER_ITEM_WIDTH = 40;
    const selectedLetterIndex = alphabet.indexOf(selectedLetter);

    return (
        <View className={`flex-1 bg-primary ${isLandscape ? "px-12" : ""}`}>
            <Image
                source={images.bg}
                className="flex-1 absolute w-full z-0"
                resizeMode="cover"
            />

            {loading && !ingredients && (
                <View className="mt-3 items-center">
                    <ActivityIndicator size="small" color="#AB8BFF" />
                </View>
            )}

            <FlatList
                ref={listRef}
                onScroll={handleScroll}
                data={ingredients?.meals ?? []}
                keyboardShouldPersistTaps="handled"
                renderItem={({ item }) => (
                    <IngredientCard
                        idIngredient={item.idIngredient}
                        strIngredient={item.strIngredient}
                        strDescription={item.strDescription}
                        strThumb={item.strThumb}
                        strType={item.strType}
                    />
                )}
                keyExtractor={(item) => item.idIngredient.toString()}
                numColumns={3}
                columnWrapperStyle={{
                    justifyContent: "space-around",
                    marginBottom: 10,
                }}
                contentContainerStyle={{
                    paddingBottom: isLandscape ? 50 : 100,
                }}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={loading}
                        onRefresh={handleRefresh}
                        tintColor="#AB8BFF"
                    />
                }
                ListHeaderComponent={
                    <>
                        <View className="relative flex-row items-center justify-center">
                            {showBackButton && (
                                <Pressable
                                    onPress={() => {
                                        router.push(backRoute);
                                    }}
                                    className="absolute left-0 p-3 mt-10"
                                >
                                    <Ionicons
                                        name="caret-back-sharp"
                                        size={24}
                                        color="#A8B5DB"
                                    />
                                </Pressable>
                            )}

                            <Image
                                source={icons.logo}
                                className="w-12 h-12 mt-12 mb-1"
                            />
                        </View>

                        {error && (
                            <View className="mt-3">
                                <Text className="text-lg text-light-200 text-center font-bold mb-3">
                                    Ingredients list failed to load
                                </Text>

                                <Text className="text-red-800 text-center">
                                    Error: {error?.message}
                                </Text>
                            </View>
                        )}

                        <Text className="text-lg text-light-200 text-center font-bold mt-5 mb-3">
                            Ingredients
                        </Text>

                        <View className="mb-3 items-center">
                            <FlatList
                                ref={letterListRef}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                className="my-3"
                                data={alphabet ?? []}
                                contentContainerStyle={{
                                    paddingRight: 3,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                                getItemLayout={(_, index) => ({
                                    length: LETTER_ITEM_WIDTH,
                                    offset: LETTER_ITEM_WIDTH * index,
                                    index,
                                })}
                                onContentSizeChange={() => {
                                    if (selectedLetterIndex >= 0) {
                                        letterListRef.current?.scrollToIndex({
                                            index: selectedLetterIndex,
                                            animated: false,
                                            viewPosition: 0.5,
                                        });
                                    }
                                }}
                                renderItem={({ item }) => (
                                    <Pressable
                                        onPress={() => {
                                            setSelectedLetter(item);
                                            handleLetterFilter(item);
                                        }}
                                        className={`py-2 px-2.5 rounded-full ${
                                            selectedLetter === item
                                                ? "bg-dark-100"
                                                : "bg-transparent"
                                        }`}
                                        style={{
                                            width: LETTER_ITEM_WIDTH,
                                        }}
                                    >
                                        <Text
                                            className={`text-center ${
                                                selectedLetter === item
                                                    ? "text-light-200 font-bold"
                                                    : "text-light-200"
                                            }`}
                                        >
                                            {item}
                                        </Text>
                                    </Pressable>
                                )}
                                keyExtractor={(item) =>
                                    `${item}${randomNumber}`
                                }
                            />
                        </View>
                    </>
                }
                ListEmptyComponent={
                    !loading && !error ? (
                        <View className="mt-10 px-5">
                            <Text className="text-center text-light-200">
                                No ingredient found
                            </Text>
                        </View>
                    ) : undefined
                }
            />

            {showScrollToTop && (
                <Pressable
                    onPress={() =>
                        listRef.current?.scrollToOffset({
                            offset: 0,
                            animated: true,
                        })
                    }
                    className={`absolute ${isLandscape ? "right-16 bottom-16" : "right-5 bottom-32"} w-14 h-14 rounded-full bg-dark-100 items-center justify-center`}
                    style={{ elevation: 5 }}
                >
                    <Ionicons name="arrow-up" size={26} color="#A8B5DB" />
                </Pressable>
            )}
        </View>
    );
};

export default IngredientView;
