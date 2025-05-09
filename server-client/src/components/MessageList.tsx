import React, { useRef, useEffect } from 'react';
import { Box, List, ListItem, Typography } from '@mui/material';
import {WsLog} from "../model/WsLog";

interface MessageListProps {
    messages: WsLog[];
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    return (
        <Box
            sx={{
                maxHeight: 400,
                overflowY: 'auto',
                mb: 2,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
            }}
        >
            {messages.length > 0 ? (
                <List>
                    {messages.map((log, index) => {
                        return (
                            <ListItem key={index} divider={index < messages.length - 1} sx={{ py: 0.5 }}>
                                <Box sx={{ display: 'flex', width: '100%' }}>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: 'text.secondary',
                                            minWidth: '90px',
                                            fontFamily: 'monospace',
                                            mr: 1
                                        }}
                                    >
                                        {log.timestamp}
                                    </Typography>
                                    <Typography
                                        sx={{
                                            fontFamily: 'monospace',
                                            wordBreak: 'break-word',
                                            whiteSpace: 'pre-wrap',
                                            flex: 1
                                        }}
                                    >
                                        {log.message}
                                    </Typography>
                                </Box>
                            </ListItem>
                        );
                    })}
                    <div ref={messagesEndRef} />
                </List>
            ) : (
                <Typography variant="body2" color="text.secondary" align="center" sx={{ p: 2 }}>
                    No messages received yet
                </Typography>
            )}
        </Box>
    );
};

export default MessageList;
