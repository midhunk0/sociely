<script lang="ts">
    import { registerUser } from "$lib/api";
    import { goto } from "$app/navigation";

    let name="", username="", email="", password="";

    async function handleRegister(e: Event) {
        e.preventDefault();
        const result=await registerUser({ name, username, email, password });
        if(result.token) {
            goto("/home");
        } else {
            alert(result.message);
        }
    };
</script>

<div class="register-page">
    <form class="register-form" on:submit={handleRegister}>
        <h1>Register</h1>
        <input type="text" bind:value={name} placeholder="Name">
        <input type="text" bind:value={username} placeholder="Username">
        <input type="email" bind:value={email} placeholder="Email">
        <input type="password" bind:value={password} placeholder="Password">
        <p>Already have an account? <a href="/login">Login</a></p>
        <button type="submit">Register</button>
    </form>
</div>

<style>
    .register-page {
        display: flex;
        height: calc(100vh - 32px);
        margin: 16px;
        border-radius: 24px;
        border: 1px solid black;
    }
    
    .register-form {
        display: flex;
        justify-content: center;
        flex-direction: column;
        padding: 16px;
        width: 30%;
        height: 100%;
        gap: 16px;
    }
    
    h1 {
        font-family: "Oswald", sans-serif;
    }

    input {
        padding: 16px;
        border: 1px solid black;
        outline: none;
        font-size: 16px;
        border-radius: 8px;
    }

    a {
        text-decoration: none;
        color: black;
    }

    a:hover {
        color: palevioletred;
    }

    button {
        padding: 16px;
        font-size: 16px;
        background-color: black;
        color: white;
        border: 1px solid black;
        outline: none;
        cursor: pointer;
        border-radius: 8px;
    }

    button:hover {
        background-color: palevioletred;
    }
</style>