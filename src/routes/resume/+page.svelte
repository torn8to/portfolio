<script>
  /** @type {import('./$types').PageProps} */
  let { data } = $props();
  let pdfUrl = "/pdf";
</script>

<iframe src={pdfUrl} width="100%" height="800px" class="pdf" title="Resume"
></iframe>

<style>
  .pdf {
    padding-top: 40px;
  }
</style>
