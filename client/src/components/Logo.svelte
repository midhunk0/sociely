<div class="logo">
    <img class="logo-image" src="/logo.png" alt="logo">
    <h2>sociely.</h2>
    <slot/>
</div>

<style>
    .logo {
        position: fixed;
        top: 32px;
        left: 32px;
        display: flex;
        align-items: center;
        gap: 12px;
    }

    .logo-image {
        width: 40px;
        height: 40px;
    }

    @media(max-width: 400px){
        .logo{
            top: 16px;
            left: 16px;
        }
    }

</style>