/**
 * @fileOverview
 * Navigation Grid
 * A OSX/Spaces-like navigable grid.
 *
 * @version 0.1.0
 * @author Jon Ferrer <jon.ferrer@mlb.com>
 */

var Nav_Grid = (function() {
    var Nav_Grid;
    
    /**
     * Renders DOM representation of Nav_Grid, it's viewport and child panels
     * inside of the Nav_Grid instance's DOM container element.
     *
     * @methodOf Nav_Grid
     * @private
     * @param {Array} grid_map 
     * @return void
     */
    function draw_grid(grid_map) 
    {
        var r, c;

        this.el.className = "navgrid-viewport";

        this.panel_container = document.createElement("div");
        this.panel_container.style.width = this.cols * this.config.panel_config.w + "px";
        this.panel_container.style.height = this.rows * this.config.panel_config.h + "px";
        this.panel_container.className = "navgrid-panelcontainer";

        // body...
        //

        for(r = 0; r < this.rows; r++)
        {
            for(c = 0; c < this.cols; c++)
            {
                panel = document.createElement("div");
                panel.id = "navgrid-panel_" + grid_map[r][c];
                panel.className = "navgrid-panel";
                panel.innerHTML = "<div>"+grid_map[r][c]+"</div>";
                this.panel_container.appendChild(panel);
            }
        }

        this.el.appendChild(this.panel_container);
    }

    /**
     * Moves grid panels container so that the current panel is visible in
     * the Nav_Grid viewport.
     *
     * @return void
     */
    function show_current_panel() 
    {
       var new_left = this.config.panel_config.w * this.curr_position_coor.x,
           new_top = this.config.panel_config.h * this.curr_position_coor.y;

       if(new_left > 0) {
            new_left = new_left * -1;
       }
       if(new_top > 0) {
            new_top = new_top * -1;
       }

       console.log("move to:", new_left, new_top);
       this.panel_container.style.left = new_left + "px";
       this.panel_container.style.top = new_top + "px";
    }

    /**
     * @constructor
     * @param {Object} config Nav_Grid configuration object
     * {
     *     "cols" : {Integer},
     *     "rows" : {Integer},
     *     "start" : {Object} coordinates of grid starting point // { "x" : 0, "y" : 2 }
     * }
     */
    Nav_Grid = function(config) 
    {
        var instance = this, 
        
            r, c, 
            grid_map = [], 
            panel_id = 0;

        this.config = config;

        this.rows = config.rows;
        this.cols = config.cols;
        this.dimensions = this.cols + "x" + this.rows;    

        this.el = document.getElementById(config.id);


        for(r = 0; r < this.rows; r++)

        {
            row = [];
            for(c = 0; c < this.cols; c++)
            {
                row.push(++panel_id);
            }
            grid_map.push(row); 
        }

        console.log('grid_map', grid_map);

        this.curr_position_coor = config.start_position;
        this.curr_position = grid_map[this.curr_position_coor.y][this.curr_position_coor.x];

        console.log(this.curr_position);

        (function() {
            instance.move = function() {
                var args = Array.prototype.slice.call(arguments);
                args.push(grid_map);
                Nav_Grid.prototype.move.apply(instance, args);
            };
        })();

        // draw grid
        draw_grid.call(this, grid_map);
        show_current_panel.call(this);
    };


    Nav_Grid.prototype = 
    {
        "add_component" : function() {},

        /**
         * Sets current panel
         */
        "move" : function(step, grid_map) {
            var new_x = this.curr_position_coor.x + step.x,
                new_y = this.curr_position_coor.y + step.y;

            // bind new coordinates to grid boundary
            if(new_x < 0)
            {
                new_x    = 0;
            }
            else if(new_x >= this.cols)
            {
                new_x = this.cols - 1;
            }

            if(new_y < 0)
            {
                new_y = 0;
            }
            else if(new_y >= this.rows)
            {
                new_y = this.rows - 1;
            }

            this.curr_position_coor = { "x" : new_x, "y" : new_y };
            this.curr_position = grid_map[this.curr_position_coor.y][this.curr_position_coor.x];

            console.log(this.curr_position);

            show_current_panel.call(this);

        }

    };

    return Nav_Grid;
})();

