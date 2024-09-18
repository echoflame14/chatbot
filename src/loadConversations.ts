// src/services/apiService.ts
import { ArchivedChat } from "./types";

export const fetchArchivedChats = async (): Promise<ArchivedChat[]> => {
    const response = await fetch('/archived-chats');
    if (!response.ok) {
        throw new Error('Failed to load archived chats');
    }
    const data = await response.json();
    return data.map((chat: { id: string; title: string; lastMessage: string }) => ({
        ...chat,
        messages: [] // Initialize messages as an empty array if not provided
    }));
};
