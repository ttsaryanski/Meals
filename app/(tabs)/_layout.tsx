import { Tabs } from "expo-router";
import {
    Image,
    ImageSourcePropType,
    PixelRatio,
    Pressable,
    StyleSheet,
    Text,
    useWindowDimensions,
    View,
} from "react-native";

import { icons } from "@/constants/icons";
import { images } from "@/constants/images";

type TabIconProps = {
    focused: boolean;
    icon: ImageSourcePropType;
    title: string;
    isFirst?: boolean;
    isLast?: boolean;
    size?: number;
    compactTabs?: boolean;
    isLandscape?: boolean;
};
function TabIcon({
    focused,
    icon,
    title,
    isFirst,
    isLast,
    size,
    compactTabs,
    isLandscape,
}: TabIconProps) {
    if (focused) {
        return (
            <View
                className={`relative flex-row w-full flex-1 ${!compactTabs || isLandscape ? "min-w-[110px]" : ""}  min-h-14 ${!isLandscape ? "my-auto" : ""} justify-center items-center rounded-full overflow-hidden`}
                style={
                    !compactTabs && isLast
                        ? {
                              ...(!isLandscape
                                  ? {
                                        justifyContent: "flex-start",
                                        paddingLeft: 13,
                                    }
                                  : {}),
                          }
                        : !compactTabs && isFirst
                          ? { ...(!isLandscape ? { paddingLeft: 18 } : {}) }
                          : {}
                }
            >
                <Image
                    source={images.highlight}
                    resizeMode="cover"
                    style={StyleSheet.absoluteFill}
                />

                <Image
                    source={icon}
                    tintColor="#151312"
                    className={`${size ? `size-${size}` : "size-5"}`}
                />
                {(!compactTabs || isLandscape) && (
                    <Text
                        className="text-dark-100 text-base font-semibold ml-2"
                        numberOfLines={1}
                        maxFontSizeMultiplier={1.3}
                    >
                        {title}
                    </Text>
                )}
            </View>
        );
    }

    return (
        <View
            className={`size-full justify-center items-center ${!isLandscape ? "mt-6" : ""} rounded-full`}
        >
            <Image
                source={icon}
                tintColor="#A8B5DB"
                className={`${size ? `size-${size}` : "size-5"}`}
            />
        </View>
    );
}

export default function TabsLayout() {
    const { width, height } = useWindowDimensions();
    const compactTabs = width < 350 || PixelRatio.getFontScale() > 1.2;
    const isLandscape = width > height;

    return (
        <Tabs
            screenOptions={{
                tabBarShowLabel: false,
                tabBarButton: ({ ref: _ref, ...props }) => (
                    <Pressable
                        {...props}
                        android_ripple={{
                            borderless: false,
                            foreground: false,
                            color: "transparent",
                        }}
                    />
                ),
                tabBarItemStyle: {
                    width: "100%",
                    height: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                },
                tabBarStyle: {
                    backgroundColor: "#221F3D",
                    borderRadius: 50,
                    marginHorizontal: isLandscape ? 20 : 5,
                    marginBottom: isLandscape ? 0 : 50,
                    height: 51,
                    position: "absolute",
                    overflow: "hidden",
                    borderWidth: 1,
                    borderColor: "#221F3D",
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "index",
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <TabIcon
                            focused={focused}
                            icon={icons.home}
                            title="Home"
                            isFirst={true}
                            compactTabs={compactTabs}
                            isLandscape={isLandscape}
                        />
                    ),
                }}
            />

            <Tabs.Screen
                name="search"
                options={{
                    title: "Search",
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <TabIcon
                            focused={focused}
                            icon={icons.search}
                            title="Search"
                            compactTabs={compactTabs}
                            isLandscape={isLandscape}
                        />
                    ),
                }}
            />

            <Tabs.Screen
                name="explore"
                options={{
                    title: "Explore",
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <TabIcon
                            focused={focused}
                            icon={icons.explore}
                            title="Explore"
                            size={6}
                            compactTabs={compactTabs}
                            isLandscape={isLandscape}
                        />
                    ),
                }}
            />

            <Tabs.Screen
                name="save"
                options={{
                    title: "Save",
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <TabIcon
                            focused={focused}
                            icon={icons.save}
                            title="Save"
                            compactTabs={compactTabs}
                            isLandscape={isLandscape}
                        />
                    ),
                }}
            />

            <Tabs.Screen
                name="about"
                options={{
                    title: "About",
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <TabIcon
                            focused={focused}
                            icon={icons.about}
                            title="About"
                            isLast={true}
                            compactTabs={compactTabs}
                            isLandscape={isLandscape}
                        />
                    ),
                }}
            />
        </Tabs>
    );
}
