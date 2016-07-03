TextLab.NewDocumentDialog = Backbone.View.extend({
    
	template: JST['textlab/templates/new-document-dialog'],
  
  id: 'document-dialog-container',
  
	partials: {
		stringInput: JST['textlab/templates/common/string-input']
	},
  
  events: {
    'click .create-button': 'onCreate',
    'click .cancel-button': 'onCancel'
  },
            	
	initialize: function(options) {
    this.callback = options.callback;
  },
  
  onCreate: function() {    
    this.close( _.bind( function() {
      this.model.set({
        name: this.$('#name').val() 
      });
      this.callback(this.model);
    }, this));
  },
  
  onCancel: function() {    
    this.close();
  },
  
  close: function( closeCallback ) {
    var documentModal = $('#new-document-modal');
    
    documentModal.on('hidden.bs.modal', _.bind( function () {
      this.$el.detach();
      if( closeCallback ) {
        closeCallback();
      }
    }, this));
    
    documentModal.modal('hide');
  },
  
  render: function() {
    this.$el.html(this.template({ document: this.model, partials: this.partials }));    
    $('#modal-container').html(this.$el);
    $('#new-document-modal').modal('show');
  } 
    
});