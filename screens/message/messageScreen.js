import { StyleSheet, Text, View, SafeAreaView, StatusBar, FlatList, Image, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Colors, Fonts, Sizes } from '../../constants/styles'
import { MaterialIcons } from '@expo/vector-icons';

import { useCallback } from 'react';

import usersList from './usersList';

// import { socket } from '../../socket';
import io from "socket.io-client";

export const socket = io("http://192.168.0.17:3000");

const MessageScreen = ({ navigation }) => {

    const [messages, setMessages] = useState([])
    const [users, setUsers] = useState([])

    const addMessage = useCallback(function (msg) {
        setMessages((messages) => {
            if (messages.length < 5) {
                return [...messages, {
                    id: msg + ' ' + Date.now(),
                    userProfilePic: require('../../assets/images/users/user26.png'),
                    userProfileName: 'Royok',
                }]
            } else {
                return []
            }
        })
        setUsers((users) => {
            if (users.length < 5) {
                return [...users, {
                    id: Date.now(),
                    userProfilePic: require('../../assets/images/users/user12.png'),
                    userProfileName: 'jiyashah_',
                    lastMsg: 'Lorem Ipsum is simply dummy text',
                    lastMsgTime: '10:50 am',
                    isActive: true,
                }]
            } else {
                return []
            }
        })
    })

    useEffect(() => {
        console.log('msg', messages)
    }, [messages])

    useEffect(() => {
        socket.on("chatMsg", (msg) => {
            addMessage(msg);
        });
        return () => {
            socket.off("chatMsg");
        };
    }, [])

    useEffect(() => {
        console.log("client initialized");
    }, []);

    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: Colors.whiteColor
            }}
        >
            <StatusBar
                translucent={false}
                backgroundColor={Colors.primaryColor}
            />
            <View style={{ flex: 1 }}>
                {header()}
                {ChatsInfo()}
            </View>
        </SafeAreaView>
    )

    function activeUsers() {
        const renderItem = ({ item }) => (
            <View style={{ alignItems: 'center', marginHorizontal: Sizes.fixPadding - 5.0, }}>
                <View>
                    <Image
                        source={item.userProfilePic}
                        style={{ width: 40.0, height: 40.0, borderRadius: 20.0 }}
                    />
                    <View style={styles.activeSmallIndicatorStyle} />
                </View>
                <Text style={{ marginTop: Sizes.fixPadding - 5.0, ...Fonts.blackColor12Regular }}>
                    {item.userProfileName}
                </Text>
            </View>
        )
        return (
            <View>
                <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={messages}
                    keyExtractor={(item) => `${item.id}`}
                    renderItem={renderItem}
                    contentContainerStyle={{ paddingHorizontal: Sizes.fixPadding + 5.0, paddingVertical: Sizes.fixPadding * 2.0, }}
                />
            </View>
        )
    }

    function ChatsInfo() {
        const renderItem = ({ item }) => (
            <View style={{ marginHorizontal: Sizes.fixPadding * 2.0, }}>
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => { navigation.push('Chat') }}
                    style={{ flexDirection: 'row', justifyContent: 'space-between' }}
                >
                    <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, }}>
                        <View>
                            <Image
                                source={item.userProfilePic}
                                style={{ width: 50.0, height: 50.0, borderRadius: 25.0, }}
                            />
                            {
                                item.isActive
                                    ?
                                    <View style={styles.activeBigIndicatorStyle} />
                                    :
                                    null
                            }
                        </View>
                        <View style={{ flex: 1, marginHorizontal: Sizes.fixPadding, }}>
                            <Text numberOfLines={1} style={{ ...Fonts.blackColor16SemiBold }}>
                                {item.userProfileName}
                            </Text>
                            <Text numberOfLines={1} style={{ ...Fonts.grayColor14Regular }}>
                                {item.lastMsg}
                            </Text>
                        </View>
                    </View>
                    <Text style={{ ...Fonts.blackColor12SemiBold }}>
                        {item.lastMsgTime}
                    </Text>
                </TouchableOpacity>
                <View style={{ backgroundColor: Colors.extraLightGrayColor, height: 1.0, marginVertical: Sizes.fixPadding }} />
            </View>
        )
        return (
            <View style={{ flex: 1 }}>
                {activeUsers()}
                <FlatList
                    data={users}
                    keyExtractor={(item) => `${item.id}`}
                    renderItem={renderItem}
                    contentContainerStyle={{ paddingBottom: Sizes.fixPadding * 8.0 }}
                />
            </View>
        )
    }

    function header() {
        return (
            <View style={styles.headerWrapStyle}>
                <Text style={{ ...Fonts.blackColor20SemiBold }}>
                    Chat
                </Text>
                <MaterialIcons name="search" size={22} color={Colors.blackColor} onPress={() => { navigation.push('SearchChat') }} />
            </View>
        )
    }
}

export default MessageScreen

const styles = StyleSheet.create({
    headerWrapStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: Colors.whiteColor,
        elevation: 2.0,
        padding: Sizes.fixPadding * 2.0,
        marginBottom: Sizes.fixPadding - 8.0
    },
    activeBigIndicatorStyle: {
        width: 10.0,
        height: 10.0,
        borderRadius: 5.0,
        bottom: 0.0,
        right: 5.0,
        backgroundColor: Colors.greenColor,
        position: 'absolute',
        borderColor: Colors.whiteColor,
        borderWidth: 1.0,
    },
    activeSmallIndicatorStyle: {
        width: 8.0,
        height: 8.0,
        borderRadius: 4.0,
        backgroundColor: Colors.greenColor,
        position: 'absolute',
        bottom: 0.0,
        right: 5.0,
    },
    callingButtonStyle: {
        width: 30.0,
        height: 30.0,
        borderRadius: 15.0,
        backgroundColor: Colors.whiteColor,
        elevation: 3.0,
        alignItems: 'center',
        justifyContent: 'center'
    },
    tabBarStyle: {
        elevation: 0.0,
        backgroundColor: Colors.whiteColor,
        marginHorizontal: Sizes.fixPadding * 2.0,
        borderBottomColor: Colors.lightGrayColor,
        borderBottomWidth: 1.5,
    }
})