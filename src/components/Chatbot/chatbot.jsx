import React, { useState } from "react";
import { View, TextInput, Button, ScrollView } from "react-native";
import Message from "./Message";
import Response from "./Responses";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const handleSend = async () => {
    // Add user message
    setMessages([...messages, { type: "user", text: input }]);
    
    // Fetch chatbot response
    // Replace with the actual call to the chatbot API
    const response = await fetchChatbotResponse(input);
    setMessages([...messages, { type: "user", text: input }, { type: "bot", text: response }]);
    
    // Clear input field
    setInput("");
  };

  // Mock function to simulate fetching a response
  const fetchChatbotResponse = async (input) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    return `Response to: ${input}`;
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <ScrollView style={{ flex: 1 }}>
        {messages.map((msg, index) => 
          msg.type === "user" ? (
            <Message key={index} message={msg.text} />
          ) : (
            <Response key={index} prompt={msg.text} />
          )
        )}
      </ScrollView>
      <TextInput
        value={input}
        onChangeText={setInput}
        placeholder="Type your message"
        style={{ borderBottomWidth: 1, marginBottom: 8 }}
      />
      <Button title="Send" onPress={handleSend} />
    </View>
  );
};

export default Chatbot;
