<script lang="ts">
    import { registerUser } from "$lib/api";
    import Logo from "../../components/Logo.svelte";
    import { goto } from "$app/navigation";

    let name="", username="", email="", password="", visible=false;

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
        <div class="register-input">
            <label for="name">Name</label>
            <input type="text" id="name" bind:value={name} placeholder="Alexander" required>
        </div>
        <div class="register-input">
            <label for="username">Username</label>
            <input type="text" id="username" bind:value={username} placeholder="Alexander" required>
        </div>
        <div class="register-input">
            <label for="email">Email</label>
            <input type="email" id="email" bind:value={email} placeholder="alexander@gmail.com" required>
        </div>
        <div class="register-input">
            <label for="password">Password</label>
            <div class="register-password">
                <input type={visible ? "text" : "password"} id="password" bind:value={password} placeholder="Password" required>
                <button type="button" on:click={()=>visible=!visible} class="eye">
                    <img src={visible ? "/eye.png" : "eye-crossed.png"} alt="eye">
                </button>
            </div>
        </div>
        <button type="submit" class="register-button">Register</button>
        <p>Already have an account? <a href="/login">Login</a></p>
    </form>
    <img class="register-image" src="/community.png" alt="community">
</div>

<Logo/>

<style>
    .register-page {
        display: flex;
        height: calc(100vh - 16px);
        margin: 8px;
        border-radius: 8px;
        gap: 16px;
    }
    
    .register-form {
        display: flex;
        justify-content: center;
        flex-direction: column;
        padding: 16px 10%;
        width: 50%;
        height: 100%;
        gap: 16px;
        border-radius: 8px;
    }

    .register-input{
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    input {
        padding: 16px;
        border: 1px solid black;
        outline: none;
        font-size: 16px;
        border-radius: 8px;
    }

    .register-password input{
        border: none;
        width: 100%;
    }

    input:focus{
        border: 1px solid #E05E35;
    }

    .register-password input:focus{
        border: none;
    }

    .register-password{
        display: flex;
        align-items: center;
        width: 100%;
        position: relative;
        border: 1px solid black;
        border-radius: 8px;
    }

    .register-password:focus-within{
        border: 1px solid #E05E35;
    }

    .eye{
        position: absolute;
        background-color: white;
        display: flex;
        border: none;
        right: 16px;
        cursor: pointer;
    }

    .eye img{
        width: 24px;
        height: 24px;
    }

    p{
        margin: 0 auto;
    }

    a {
        text-decoration: underline;
        color: black;
    }

    a:hover {
        color: #E05E35;
    }

    .register-button {
        padding: 16px;
        font-size: 16px;
        background-color: black;
        color: white;
        border: 1px solid black;
        outline: none;
        cursor: pointer;
        border-radius: 8px;
    }

    .register-button:hover {
        background-color: #E05E35;
    }

    .register-image {
        width: calc(50% - 8px);
        object-fit: cover;
        border-radius: 8px;
    }

    @media(max-width: 1080px){
        .register-form{
            padding: 16px;
        }
    }

    @media(max-width: 600px){
        .register-image{
            display: none;
        }

        .register-form{
            width: 100%;
        }
    }

    @media(max-width: 400px){
        .register-page{
            margin: 0;
            border: none;
            height: 100vh;
        }
    }
</style>