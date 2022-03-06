<script lang="ts">
  export let sender: string
  export let color: string = 'aquamarine'
  export let payload: string
</script>

<span class="message">
  <span class="sender" style="color: {color};">{sender}: </span>
  <span class="payload">{payload}</span>
</span>

<style>
  .message {
    display: inline-block;
    font-size: 14px;
    margin-bottom: 0.25rem;
  }

  .sender {
    font-weight: bold;
  }

  .payload {
    color: var(--light100);
    font-weight: normal;
  }
</style>
