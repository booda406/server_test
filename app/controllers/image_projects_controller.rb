class ImageProjectsController < ApplicationController
  before_action :set_image_project, only: [:show, :edit, :update, :destroy]

  # GET /image_projects
  # GET /image_projects.json
  def index
    @image_projects = ImageProject.all
  end

  # GET /image_projects/1
  # GET /image_projects/1.json
  def show
  end

  # GET /image_projects/new
  def new
    @image_project = ImageProject.new
  end

  # GET /image_projects/1/edit
  def edit
  end

  # POST /image_projects
  # POST /image_projects.json
  def create
    @image_project = ImageProject.new(image_project_params)

    respond_to do |format|
      if @image_project.save
        format.html { redirect_to @image_project, notice: 'Image project was successfully created.' }
        format.json { render action: 'show', status: :created, location: @image_project }
      else
        format.html { render action: 'new' }
        format.json { render json: @image_project.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /image_projects/1
  # PATCH/PUT /image_projects/1.json
  def update
    respond_to do |format|
      if @image_project.update(image_project_params)
        format.html { redirect_to @image_project, notice: 'Image project was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: 'edit' }
        format.json { render json: @image_project.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /image_projects/1
  # DELETE /image_projects/1.json
  def destroy
    @image_project.destroy
    respond_to do |format|
      format.html { redirect_to image_projects_url }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_image_project
      @image_project = ImageProject.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def image_project_params
      params.require(:image_project).permit(:name, :framework, project_images_attributes:[:project_id, :image_data, :image])
    end

    def upload_image(image_io)
        extension = File.extname(image_io.original_filename)

        image_url = "/project_images/" + @image_project.id.to_s + extension

        File.open("public" + image_url, 'wb') do |file|
          file.write(image_io.read)
        end

        @image_project.update_attribute(:image_url, image_url)
    end

end
