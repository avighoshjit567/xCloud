import { Table, Flex, ActionIcon, Text, Button, Modal, TextInput, Select, Notification, Group, Pagination, Paper, LoadingOverlay, Box } from '@mantine/core';
import { modals } from '@mantine/modals';
import { IconCheck, IconPencil, IconTrash, IconX } from '@tabler/icons-react';
import { showNotification } from '@mantine/notifications';
import React, { useEffect, useState } from 'react';

function Servers() {
    // Add server modal state
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [newName, setNewName] = useState("");
    const [newIpAddress, setNewIpAddress] = useState("");
    const [newProvider, setNewProvider] = useState("");
    const [newCpuCores, setNewCpuCores] = useState("");
    const [newRamMb, setNewRamMb] = useState("");
    const [newStorageGb, setNewStorageGb] = useState("");
    const [newStatus, setNewStatus] = useState("");
    // Add server handler
    const handleAddServer = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${import.meta.env.VITE_API_URL}/server/create`, {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    name: newName,
                    ip_address: newIpAddress,
                    provider: newProvider,
                    cpu_cores: newCpuCores,
                    ram_mb: newRamMb,
                    storage_gb: newStorageGb,
                    status: newStatus
                })
            });
            const data = await response.json();
            if (response.ok && data.server) {
                setServers(prev => [data.server, ...prev]);
                setNotification({
                    show: true,
                    color: 'teal',
                    icon: <IconCheck size={20} />,
                    title: 'Congrats!',
                    message: data.message || 'Server updated successfully',
                });
                setAddModalOpen(false);
                setNewName("");
                setNewIpAddress("");
                setNewProvider("");
                setNewCpuCores("");
                setNewRamMb("");
                setNewStorageGb("");
                setNewStatus("");
            } else {

                setNotification({
                    show: true,
                    color: 'red',
                    icon: <IconX size={20} />,
                    title: 'Error!',
                    message: data.message || 'Failed to create server',
                });
            }
        } catch (e) {
            showNotification({
                icon: <IconX size={20} />,
                color: 'red',
                title: 'Error!',
                message: 'Network error',
                autoClose: 3000,
                position: 'bottom-right',
            });
        }
    };

    const [servers, setServers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedServer, setSelectedServer] = useState(null);

    const [name, setName] = useState("");
    const [ipAddress, setIpAddress] = useState("");
    const [provider, setProvider] = useState("");
    const [cpuCores, setCpuCores] = useState("");
    const [ramMb, setRamMb] = useState("");
    const [storageGb, setStorageGb] = useState("");
    const [status, setStatus] = useState("");

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [perPage] = useState(10);
    const [search, setSearch] = useState("");

    // Notification state
    const [notification, setNotification] = useState({ show: false, color: 'teal', icon: <IconCheck size={20} />, title: '', message: '' });

    // Auto-dismiss notification after 3 seconds
    useEffect(() => {
        let timer;
        if (notification.show) {
            timer = setTimeout(() => {
                setNotification(n => ({ ...n, show: false }));
            }, 3000);
        }
        return () => clearTimeout(timer);
    }, [notification.show]);

    useEffect(() => {
        const fetchServers = async () => {
            setLoading(true);
            setError("");
            try {
                const token = localStorage.getItem("token");
                const url = `${import.meta.env.VITE_API_URL}/server/list?per_page=${perPage}&page=${currentPage}${search ? `&search=${encodeURIComponent(search)}` : ''}`;
                const response = await fetch(url, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (!response.ok) {
                    throw new Error("Failed to fetch server list");
                }
                const data = await response.json();
                setServers(data.servers || []);
                setTotalPages(data.pagination ? data.pagination.last_page : 1);
            } catch (e) {
                setError(e.message || "Error fetching servers");
            } finally {
                setLoading(false);
            }
        };
        fetchServers();
    }, [currentPage, perPage, search]);

    const handleEdit = async (server) => {
        setSelectedServer(server);
        setName(server.name || "");
        setIpAddress(server.ip_address || "");
        setProvider(server.provider || "");
        setCpuCores(server.cpu_cores ? String(server.cpu_cores) : "");
        setRamMb(server.ram_mb ? String(server.ram_mb) : "");
        setStorageGb(server.storage_gb ? String(server.storage_gb) : "");
        setStatus(server.status || "");
        setModalOpen(true);
    };

    const handleDelete = async (server) => {
        setSelectedServer(server);
        modals.openConfirmModal({
            title: 'Delete your server',
            centered: true,
            children: (
                <Text size="sm">
                    Are you sure you want to delete Server?
                </Text>
            ),
            labels: { confirm: 'Delete', cancel: "No don't delete it" },
            centered: true,
            confirmProps: { color: 'red' },
            onCancel: () => console.log('Cancel'),
            onConfirm: async () => {
                try {
                    const token = localStorage.getItem("token");
                    const response = await fetch(`${import.meta.env.VITE_API_URL}/server/${server.id}`, {
                        method: "DELETE",
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    });
                    const data = await response.json();
                    if (data.status === 200) {
                        setServers(prev => prev.filter(s => s.id !== server.id));
                        setNotification({
                            show: true,
                            color: 'teal',
                            icon: <IconCheck size={20} />,
                            title: 'Congrats!',
                            message: data.message || 'Server deleted successfully',
                        });
                    } else {
                        setNotification({
                            show: true,
                            color: 'red',
                            icon: <IconX size={20} />,
                            title: 'Error!',
                            message: data.message || 'Server delete failed',
                        });
                    }
                } catch (e) {
                    setError(e.message || "Error fetching servers");
                } finally {
                    setLoading(false);
                }
            },
        });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${import.meta.env.VITE_API_URL}/server/${selectedServer.id}`, {
                method: "PUT",
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ id: selectedServer.id, name: name, ip_address: ipAddress, provider: provider, cpu_cores: cpuCores, ram_mb: ramMb, storage_gb: storageGb, status: status })
            });
            const data = await response.json();
            if (data.status === 200) {
                setServers(prev =>
                    prev.map(s => s.id === selectedServer.id ? data.server : s)
                );
                setNotification({
                    show: true,
                    color: 'teal',
                    icon: <IconCheck size={20} />,
                    title: 'All good!',
                    message: data.message || 'Server updated successfully',
                });
            } else {
                setNotification({
                    show: true,
                    color: 'red',
                    icon: <IconX size={20} />,
                    title: 'Error!',
                    message: data.message || 'Server update failed',
                });
            }
        } catch (e) {
            setNotification({
                show: true,
                color: 'red',
                icon: <IconX size={20} />,
                title: 'Error!',
                message: 'Network error',
            });
        }

        setModalOpen(false);
    };

    const rows = servers.map((server, index) => (
        <Table.Tr key={server.id || index}>
            <Table.Td>{index + 1}</Table.Td>
            <Table.Td>{server.name}</Table.Td>
            <Table.Td>{server.ip_address || '-'}</Table.Td>
            <Table.Td>{server.provider || '-'}</Table.Td>
            <Table.Td>{server.cpu_cores || '-'}</Table.Td>
            <Table.Td>{server.ram_mb || '-'}</Table.Td>
            <Table.Td>{server.storage_gb || '-'}</Table.Td>
            <Table.Td>{server.status || '-'}</Table.Td>
            <Table.Td>
                <ActionIcon variant="filled" size="lg" aria-label="Settings"
                    onClick={() => handleEdit(server)}
                >
                    <IconPencil size={22} stroke={1.5} />
                </ActionIcon>
                <ActionIcon variant="filled" ml={5} color="red" size="lg" aria-label="Settings"
                    onClick={() => handleDelete(server)}
                >
                    <IconTrash size={22} stroke={1.5} />
                </ActionIcon>
            </Table.Td>
        </Table.Tr>
    ));

    return (
        <>
            {notification.show && (
                <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999 }}>
                    <Notification
                        icon={notification.icon}
                        color={notification.color}
                        title={notification.title}
                        onClose={() => setNotification({ ...notification, show: false })}
                        mt="md"
                    >
                        {notification.message}
                    </Notification>
                </div>
            )}
            <Flex justify="center" align="center" style={{ minHeight: '100vh', background: '#f8f9fa', padding: 40 }}>
                <Box style={{ width: '100%', maxWidth: 1200, position: 'fixed', top: 20, right: 20, left: 20 }}>
                    <Paper shadow="md" radius="md" p="xl" withBorder>
                        <LoadingOverlay visible={loading} />
                        <Group position="apart" mb="md">
                            <Text size="xl" weight={700}>Servers</Text>
                            <TextInput
                                placeholder="Search by name, IP, provider, status..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                style={{ maxWidth: 300 }}
                            />
                            <Button variant="filled" color="blue" onClick={() => setAddModalOpen(true)}>Add Server</Button>
                        </Group>
                        <Table striped highlightOnHover withTableBorder withColumnBorders verticalSpacing="md" fontSize="md">
                            <Table.Thead>
                                <Table.Tr>
                                    <Table.Th>#</Table.Th>
                                    <Table.Th>Name</Table.Th>
                                    <Table.Th>IP Address</Table.Th>
                                    <Table.Th>Provider</Table.Th>
                                    <Table.Th>CPU Cores</Table.Th>
                                    <Table.Th>RAM (MB)</Table.Th>
                                    <Table.Th>Storage (GB)</Table.Th>
                                    <Table.Th>Status</Table.Th>
                                    <Table.Th>Actions</Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                                {error ? (
                                    <Table.Tr>
                                        <Table.Td colSpan={9}>
                                            <Text c="red" align="center">{error}</Text>
                                        </Table.Td>
                                    </Table.Tr>
                                ) : rows.length > 0 ? rows : (
                                    <Table.Tr>
                                        <Table.Td colSpan={9}>
                                            <Text align="center">No servers found.</Text>
                                        </Table.Td>
                                    </Table.Tr>
                                )}
                            </Table.Tbody>
                        </Table>
                        <Group position="right" mt="md">
                            <Pagination
                                value={currentPage}
                                onChange={setCurrentPage}
                                total={totalPages}
                                color="blue"
                                radius="md"
                                size="md"
                                withEdges
                            />
                        </Group>
                    </Paper>
                </Box>
            </Flex>

            <Modal opened={modalOpen} onClose={() => setModalOpen(false)} title="Edit Server" centered>
                <form onSubmit={handleUpdate}>
                    <TextInput
                        label="Name"
                        description="The name of the server"
                        placeholder="My Server"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        required
                        mb={10}
                    />
                    <TextInput
                        label="IP Address"
                        description="The IP address of the server"
                        placeholder="192.168.1.1"
                        value={ipAddress}
                        onChange={e => setIpAddress(e.target.value)}
                        required
                        mb={10}
                    />
                    <Select
                        label="Provider"
                        description="The provider of the server"
                        placeholder="Pick value"
                        data={['aws', 'digitalocean', 'vultr', 'others']}
                        value={provider}
                        onChange={setProvider}
                        required
                        mb={10}
                    />
                    <TextInput
                        label="CPU Cores"
                        description="The number of CPU cores"
                        placeholder="4"
                        value={cpuCores}
                        onChange={e => setCpuCores(e.target.value)}
                        required
                    />
                    <TextInput
                        label="RAM (MB)"
                        description="The amount of RAM in MB"
                        placeholder="8192"
                        value={ramMb}
                        onChange={e => setRamMb(e.target.value)}
                        required
                        mb={10}
                    />
                    <TextInput
                        label="Storage (GB)"
                        description="The amount of storage in GB"
                        placeholder="100"
                        value={storageGb}
                        onChange={e => setStorageGb(e.target.value)}
                        required
                        mb={10}
                    />
                    <Select
                        label="Status"
                        description="The status of the server"
                        placeholder="Pick value"
                        data={['active', 'inactive', 'maintenance']}
                        value={status}
                        onChange={setStatus}
                        required
                        mb={10}
                    />
                    <Button type="submit" variant="filled" color="blue" fullWidth style={{ marginTop: 14 }}>
                        Updated
                    </Button>
                </form>
            </Modal>

            {/* Add Server Modal */}
            <Modal opened={addModalOpen} onClose={() => setAddModalOpen(false)} title="Add Server" centered>
                <form onSubmit={handleAddServer}>
                    <TextInput
                        label="Name"
                        description="The name of the server"
                        placeholder="My Server"
                        value={newName}
                        onChange={e => setNewName(e.target.value)}
                        required
                        mb={10}
                    />
                    <TextInput
                        label="IP Address"
                        description="The IP address of the server"
                        placeholder="192.168.1.1"
                        value={newIpAddress}
                        onChange={e => setNewIpAddress(e.target.value)}
                        required
                        mb={10}
                    />
                    <Select
                        label="Provider"
                        description="The provider of the server"
                        placeholder="Pick value"
                        data={['aws', 'digitalocean', 'vultr', 'others']}
                        value={newProvider}
                        onChange={setNewProvider}
                        required
                        mb={10}
                    />
                    <TextInput
                        label="CPU Cores"
                        description="The number of CPU cores"
                        placeholder="4"
                        value={newCpuCores}
                        onChange={e => setNewCpuCores(e.target.value)}
                        required
                    />
                    <TextInput
                        label="RAM (MB)"
                        description="The amount of RAM in MB"
                        placeholder="8192"
                        value={newRamMb}
                        onChange={e => setNewRamMb(e.target.value)}
                        required
                        mb={10}
                    />
                    <TextInput
                        label="Storage (GB)"
                        description="The amount of storage in GB"
                        placeholder="100"
                        value={newStorageGb}
                        onChange={e => setNewStorageGb(e.target.value)}
                        required
                        mb={10}
                    />
                    <Select
                        label="Status"
                        description="The status of the server"
                        placeholder="Pick value"
                        data={['active', 'inactive', 'maintenance']}
                        value={newStatus}
                        onChange={setNewStatus}
                        required
                        mb={10}
                    />
                    <Button type="submit" variant="filled" color="blue" fullWidth style={{ marginTop: 14 }}>
                        Add Server
                    </Button>
                </form>
            </Modal>
        </>
    );
}

export default Servers;