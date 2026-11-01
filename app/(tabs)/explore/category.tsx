import { useRouter } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Image,
    Pressable,
    Text,
    TextInput,
    TouchableOpacity,
    useWindowDimensions,
    View,
} from "react-native";

import useFetch from "@/hooks/useFetch";
import { mealServices } from "@/services/mealServices";

import CategoryFooter from "@/components/category-footer";

import { Ionicons } from "@expo/vector-icons";

import { icons } from "@/constants/icons";
import { images } from "@/constants/images";

const Category = () => {
    const router = useRouter();
    const listRef = useRef<FlatList>(null);
    const { width, height } = useWindowDimensions();
    const isLandscape = width > height;

    const [query, setQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string>("Beef");
    const [showScrollToTop, setShowScrollToTop] = useState(false);
    const [isSelected, setIsSelected] = useState(false);
    const [showAllOptions, setShowAllOptions] = useState(false);

    const {
        data: categoryList,
        loading,
        error,
        refetch,
    } = useFetch(() => mealServices.getSympleCategoryList("c"), false);

    const filteredOptions = useMemo(() => {
        if (!query || query.length < 1) return [];
        return categoryList?.meals?.filter((item) =>
            item.strCategory.toLowerCase().includes(query.toLowerCase()),
        );
    }, [query, categoryList]);

    useEffect(() => {
        refetch();
    }, [selectedCategory, refetch]);

    const handleScroll = (event: any) => {
        const offsetY = event.nativeEvent.contentOffset.y;

        setShowScrollToTop(offsetY > 400);
    };

    return (
        <View className={`flex-1 bg-primary ${isLandscape ? "px-12" : ""}`}>
            <Image
                source={images.bg}
                className="flex-1 absolute w-full z-0"
                resizeMode="cover"
            />

            {loading && !categoryList && (
                <View className="mt-3 items-center">
                    <ActivityIndicator size="small" color="#AB8BFF" />
                </View>
            )}

            <FlatList
                ref={listRef}
                onScroll={handleScroll}
                data={
                    isSelected
                        ? []
                        : showAllOptions
                          ? (categoryList?.meals ?? [])
                          : (filteredOptions ?? [])
                }
                keyboardShouldPersistTaps="handled"
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => {
                            setSelectedCategory(item.strCategory);
                            setQuery(item.strCategory);
                            setIsSelected(true);
                        }}
                        className={` ${isSelected && selectedCategory === item.strCategory ? "" : "w-2/3 mx-auto items-center px-4 py-3 border-b border-light-200"}`}
                    >
                        {(!isSelected ||
                            selectedCategory !== item.strCategory) && (
                            <Text className="text-center text-light-200">
                                {item.strCategory}
                            </Text>
                        )}
                    </TouchableOpacity>
                )}
                contentContainerStyle={{
                    paddingBottom: isLandscape ? 110 : 170,
                }}
                keyExtractor={(item) => `${item.strCategory}${Math.random()}`}
                ListHeaderComponent={
                    <>
                        <View className="relative flex-row items-center justify-center">
                            <Pressable
                                onPress={() => {
                                    router.push("/explore");
                                }}
                                className="absolute left-0 p-3 mt-10"
                            >
                                <Ionicons
                                    name="caret-back-sharp"
                                    size={24}
                                    color="#A8B5DB"
                                />
                            </Pressable>

                            <Image
                                source={icons.logo}
                                className="w-12 h-12 mt-12 mb-1"
                            />
                        </View>

                        {error && (
                            <View className="mt-3">
                                <Text className="text-lg text-light-200 text-center font-bold mb-3">
                                    Category list failed to load
                                </Text>

                                <Text className="text-red-800 text-center">
                                    Error: {error?.message}
                                </Text>
                            </View>
                        )}

                        <Text className="text-lg text-light-200 text-center font-bold mt-5 mb-3">
                            Categories
                        </Text>

                        <TextInput
                            value={query}
                            onFocus={() => {
                                setIsSelected(false);
                                setShowAllOptions(true);
                            }}
                            onChangeText={(text) => {
                                setQuery(text);
                                setIsSelected(false);
                                setShowAllOptions(false);
                            }}
                            placeholder="Search category..."
                            placeholderTextColor="#a8b5db"
                            className="border border-light-200 rounded-lg mx-2 px-4 py-3 text-light-200 bg-dark-100"
                            numberOfLines={1}
                            multiline={false}
                            maxFontSizeMultiplier={1.2}
                        />
                    </>
                }
                ListFooterComponent={
                    <CategoryFooter
                        category={selectedCategory}
                        isLandscape={isLandscape}
                    />
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
export default Category;

export const randomNumber = Math.floor(Math.random() * (999 - 100 + 1)) + 100;
