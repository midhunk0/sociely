<script lang="ts">
    import { loginUser } from "$lib/api";
    import { goto } from "$app/navigation";

    let credential="", password="";

    async function handleLogin(e: Event) {
        e.preventDefault();
        const result=await loginUser({ credential, password });
        if(result.token) {
            goto("/home");
        } else {
            alert(result.message);
        }
    };
</script>

<div class="login-page">
    <form class="login-form" on:submit={handleLogin}>
        <h1>Login</h1>
        <input type="text" bind:value={credential} placeholder="Email or Username">
        <input type="password" bind:value={password} placeholder="Password">
        <p>Don't have an account? <a href="/register">Register</a></p>
        <button type="submit">Login</button>
    </form>
</div>

<style>
    .login-page {
        display: flex;
        height: calc(100vh - 32px);
        margin: 16px;
        border-radius: 24px;
        border: 1px solid black;
    }
    
    .login-form {
        display: flex;
        justify-content: center;
        flex-direction: column;
        padding: 16px;
        width: 25%;
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

    @media(max-width: 1300px){
        .login-form{
            width: 30%;
        }
    }

    @media(max-width: 1080px){
        .login-form{
            width: 40%;
        }
    }

    @media(max-width: 850px){
        .login-form{
            width: 50%;
        }
    }

    @media(max-width: 600px){
        .login-form{
            width: 100%;
        }
    }

    @media(max-width: 400px){
        .login-page{
            margin: 0;
            border: none;
            height: 100vh;
        }
    }
</style>