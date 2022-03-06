<script lang="ts">
  import Message from './Message.svelte'
</script>

<aside>
  <section class="header-container">Hi</section>

  <section class="message-container">
    <Message color="lightskyblue" sender="bloodzmoon" payload="ทดสอบครับ" />
    <Message color="lightskyblue" sender="bloodzmoon" payload="ทดสอบครับ" />
    <Message color="lightskyblue" sender="bloodzmoon" payload="ทดสอบครับ" />
    <Message color="lightskyblue" sender="bloodzmoon" payload="ทดสอบครับ" />
    <Message color="lightskyblue" sender="bloodzmoon" payload="ทดสอบครับ" />
  </section>

  <section class="input-container">
    <input />
  </section>
</aside>

<style>
  aside {
    outline: 6px solid var(--dark400);
    border-radius: 0.5rem;
    background: var(--dark500);
    margin-left: 2rem;
    width: 240px;
    height: 600px;

    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .header-container {
    padding: 1rem;

    height: 60px;
    background: var(--dark400);
  }

  .message-container {
    flex: 1;
    padding: 1rem;

    overflow-y: auto;

    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* Internet Explorer 10+ */
  }

  .message-container::-webkit-scrollbar {
    /* WebKit */
    width: 0;
    height: 0;
  }

  .input-container {
    padding: 1rem;

    height: 60px;
    background: var(--dark400);
  }
</style>
