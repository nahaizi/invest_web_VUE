const LoadTab = {
    created(){
        var {name, params: {id}} = this.$route;
        this.$parent.id = id;
        this.$parent.tab = name;
    },
};

export {
    LoadTab,
}
