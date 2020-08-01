<template>
  <label class="file-lbl">
    <input class="file-input" type="file" :accept="accept" @change="newUpload" :multiple="multiple" />
    <slot>Upload</slot>
  </label>
</template>

<script>
export default {
  name: "FileUpload",
  props: {
    accept: String,
    multiple: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    newUpload(event) {
      if (this.multiple) {
        this.$emit("new-upload", event.target.files);
      } else {
        this.$emit("new-upload", event.target.files[0]);
      }
    },
  },
};
</script>

<style scoped>
.file-lbl {
  background-color: #500000;
  border: none;
  border-radius: 8px;
  color: #fff;
  display: inline-block;
  padding: 0.5em;
  text-align: center;
}

.file-lbl:hover {
  background-color: #3c0000;
  color: #eef0f0;
}

.file-input {
  display: none;
}
</style>