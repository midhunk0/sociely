<script lang="ts">
    import { loginUser } from "$lib/api";
    import Logo from "../../components/Logo.svelte";
    import { goto } from "$app/navigation";

    let credential="", password="", visible=false;

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
    <img class="login-image" src="/community.png" alt="community">
    <form class="login-form" on:submit={handleLogin}>
        <h1>Login</h1>
        <div class="login-input">
            <label for="credential">Email or Username</label>
            <input type="text" id="credential" bind:value={credential} placeholder="Alexander" required>
        </div>
        <div class="login-input">
            <label for="password">Password</label>
            <div class="login-password">
                <input type={visible ? "text" : "password"} id="password" bind:value={password} placeholder="Password" required>
                <button type="button" on:click={()=>visible=!visible} class="eye">
                    <img src={visible ? "/eye-white.png" : "eye-crossed-white.png"} alt="eye">
                </button>
            </div>
        </div>
        <button type="submit" class="login-button">Login</button>
        <p>Don't have an account? <a href="/register">Register</a></p>
    </form>
</div>

<Logo/>

<style>
    .login-page{
        display: flex;
        height: 100vh;
        padding: 8px;
        gap: 8px;
        background-color: var(--bg1);
        color: var(--text1);
    }

    .login-image { 
        width: calc(50% - 4px);
        object-fit: cover;
        border-radius: 8px;
    }

    .login-form {
        display: flex;
        justify-content: center;
        flex-direction: column;
        padding: 16px 10%;
        width: 50%;
        height: 100%;
        gap: 16px;
        border-radius: 8px;
    }

    input {
        padding: 16px;
        background-color: var(--bg2);
        color: var(--text1);
        border: 1px solid var(--bg1);
        outline: none;
        font-size: 16px;
        border-radius: 8px;
    }

    .login-password input{
        border: none;
        width: 100%;
    }

    input:focus{
        border: 1px solid var(--orange);
    }

    .login-password input:focus{
        border: none;
    }

    .login-input{
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    .login-password{
        display: flex;
        align-items: center;
        width: 100%;
        position: relative;
        border: 1px solid var(--bg1);
        border-radius: 8px;
    }

    .login-password:focus-within{
        border: 1px solid var(--orange);
    }

    .eye{
        background-color: var(--bg2);
        border: none;
        display: flex;
        position: absolute;
        cursor: pointer;
        right: 16px;
    }
    
    .eye img{
        width: 24px;
        height: 24px;
    }

    p{
        margin: 0 auto;
    }
    
    a{
        text-decoration: underline;
        color: var(--text1);
    }

    a:hover{
        color: var(--orange);
    }

    .login-button{
        padding: 16px;
        font-size: 16px;
        background-color: var(--text1);
        color: var(--bg1);
        border: 1px solid var(--bg1);
        outline: none;
        cursor: pointer;
        border-radius: 8px;
    }

    .login-button:hover{
        color: var(--text1);
        background-color: var(--orange);
    }

    @media(max-width: 1080px){
        .login-form{
            padding: 16px;
        }
    }

    @media(max-width: 600px){
        .login-image{
            display: none;
        }

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