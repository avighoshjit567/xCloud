import React, { useState } from "react";
import { Card, TextInput, Text, Button, Group, Flex } from '@mantine/core';
// import logo from '../assets/react.svg';

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();
            if (response.ok && data.token) {
                localStorage.setItem("token", data.token);
                window.location.href = "/servers";
            } else {
                setError(data.message || "Login failed");
            }
        } catch (e) {
            setError("Network error");
        }
    };

    return (
        <Flex
            justify="center"
            align="center"
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                margin: 0,
                padding: 0,
                zIndex: 10,
            }}
        >
            <Card shadow="sm" padding="lg" withBorder>
                <form onSubmit={handleLogin}>
                    <Group position="apart" style={{ marginBottom: 5, marginTop: 15 }}>
                        <Text weight={500}>Welcome to xCloud</Text>
                    </Group>

                    <Text size="sm" mb={10} style={{ color: 'gray', lineHeight: 1.5 }}>
                        Please log in to continue to the application.
                    </Text>

                    <TextInput
                        label="Email"
                        description="Your email address"
                        placeholder="you@example.com"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                        mb={10}
                    />

                    <TextInput
                        label="Password"
                        description="Your account password"
                        placeholder="••••••••"
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                        mb={10}
                    />

                    <Button type="submit" variant="filled" color="blue" fullWidth style={{ marginTop: 14 }}>
                        Log In
                    </Button>
                    {error && (
                        <Text color="red" align="center" mt={10}>{error}</Text>
                    )}
                </form>
            </Card>
        </Flex>
    );
}

export default Login;