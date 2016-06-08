TextLab.LeafImageViewer = Backbone.View.extend({

	template: JST['textlab/templates/leaf-image-viewer'],
    
  id: 'leaf-image-viewer',
  
  events: {
    'click #add-mode-button': 'addMode',
    'click #nav-mode-button': 'navMode',
    'click #toggle-regions-button': 'toggleRegions'
  },
            	
	initialize: function(options) {
    
    _.bindAll( this, "onDrag", "onDragEnd", "onDragStart", "addRectangularRegion", "selectRegion" );

    this.dragStart = null;
    
    this.regions = [  ];
    
    this.tileSource = '{"type":"legacy-image-pyramid","levels":[{"url":"https://staging-uploads-juxtaeditions.s3.amazonaws.com/uploads-juxtaeditions.s3.amazonaws.com/uploads/1422303907274-3mlxforsfydjkyb9-35ecdf6c89905871192303efb67f3d16/Page2-3.jpg","width":336,"height":530},{"url":"https://staging-uploads-juxtaeditions.s3.amazonaws.com/uploads-juxtaeditions.s3.amazonaws.com/uploads/1422303907274-3mlxforsfydjkyb9-35ecdf6c89905871192303efb67f3d16/Page2-2.jpg","width":671,"height":1059},{"url":"https://staging-uploads-juxtaeditions.s3.amazonaws.com/uploads-juxtaeditions.s3.amazonaws.com/uploads/1422303907274-3mlxforsfydjkyb9-35ecdf6c89905871192303efb67f3d16/Page2-1.jpg","width":1342,"height":2117},{"url":"https://staging-uploads-juxtaeditions.s3.amazonaws.com/uploads/1422303907274-3mlxforsfydjkyb9-35ecdf6c89905871192303efb67f3d16/Page2.jpg","width":2683,"height":4234}]}';
    
  },
  
  addMode: function() {
    this.mode = 'add';
    this.viewer.setMouseNavEnabled(false);
    $('#add-mode-button').addClass('active');
    $('#nav-mode-button').removeClass('active');
  },
    
  navMode: function() {
    this.mode = 'nav';
    this.viewer.setMouseNavEnabled(true);
    $('#nav-mode-button').addClass('active');
    $('#add-mode-button').removeClass('active');
  },
  
  toggleRegions: function() {
    // TODO toggle the visibility of the regions
  },
  
  selectRegion: function() {
    // TODO if in edit mode, selects a region
    alert('click')
  },
  
  onDragStart: function(event) {
    if( this.mode == 'add' ) {
      this.dragStart = paper.view.viewToProject(new paper.Point(event.position.x, event.position.y));
    }
  },
  
  onDrag: function(event) {
    if ( this.mode == 'add' && this.dragStart) {
      var to = paper.view.viewToProject(new paper.Point(event.position.x, event.position.y));
      
      if( this.draggingRectangle ) {
        this.draggingRectangle.remove();  
      }
      
      this.draggingRectangle = this.addRectangularRegion({ 
        top: this.dragStart.y, 
        left: this.dragStart.x, 
        bottom: to.y, 
        right: to.x 
      });
      
      paper.view.draw();
    }
  },
  
  onDragEnd: function(event) {
    if (this.dragStart) {
      // TODO add this to the list of regions (check if in add mode)
      this.dragStart = null;
      this.draggingRectangle = null;
    }
  },
      
  render: function() {        
    this.$el.html(this.template()); 
  },
  
  addRectangularRegion: function( region ) {
    var from = new paper.Point(region.left,region.top);
    var to = new paper.Point(region.right,region.bottom);
    var rect = new paper.Path.Rectangle(from, to);
    rect.strokeColor = 'red';
    rect.strokeWidth = 8;
    rect.onMouseDown = this.onSelectRegion;
    return rect;
  },
  
  initViewer: function() {      
        
		this.viewer = OpenSeadragon({
			id : "openseadragon",
			prefixUrl : "/openseadragon/",
      showFullPageControl: false,
      zoomInButton: 'zoom-in-button',
      zoomOutButton: 'zoom-out-button',
      showHomeControl: false,
      gestureSettingsMouse: {
        clickToZoom: false,
        dblClickToZoom: false,
        flickEnabled: false
      }
		});
            
    new OpenSeadragon.MouseTracker({
      element: this.viewer.canvas,
      pressHandler: this.onDragStart,
      dragHandler: this.onDrag,
      dragEndHandler: this.onDragEnd
    }).setTracking(true);
    
    this.overlay = this.viewer.paperjsOverlay();
    
    var self = this;
    var renderRegions = function(overlay, event) {      
      _.each( self.regions, self.addRectangularRegion );
      overlay.resize();
      overlay.resizecanvas();
    }.bind(null, this.overlay);
        
    this.viewer.addTiledImage({
        tileSource: this.tileSource,
        x: 0,
        y: 0,
        success: renderRegions
    });
    
    this.navMode();
  }
  
});