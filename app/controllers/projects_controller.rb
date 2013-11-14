class ProjectsController < ApplicationController
  before_action :set_project, only: [:show, :edit, :update, :destroy]

  # GET /projects
  # GET /projects.json
  def index
    @projects = Project.all
  end

  # GET /projects/1
  # GET /projects/1.json
  def show
  end

  # GET /projects/new
  def new
    @project = Project.new
    3.times do
      @project.avatars.build
    end
  end

  # GET /projects/1/edit
  def edit
  end

  # POST /projects
  # POST /projects.json
  def create

          #check if file is within picture_path
      if params[:project][:avatar]["file"]
           picture_path_params = params[:project][:avatar]
           #create a new tempfile named fileupload
           tempfile = Tempfile.new("fileupload")
           tempfile.binmode
           #get the file and decode it with base64 then write it to the tempfile
           tempfile.write(Base64.decode64(picture_path_params["file"]))
     
           #create a new uploaded file
           uploaded_file = ActionDispatch::Http::UploadedFile.new(:tempfile => tempfile, :filename => picture_path_params["filename"], :original_filename => picture_path_params["original_filename"]) 
     
           #replace picture_path with the new uploaded file
           params[:project][:avatar] =  uploaded_file
     
      end

    @project = Project.new(project_params)

    respond_to do |format|
      if @project.save
        format.html { redirect_to @project, notice: 'Project was successfully created.' }
        format.json { render action: 'show', status: :created, location: @project }
      else
        format.html { render action: 'new' }
        format.json { render json: @project.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /projects/1
  # PATCH/PUT /projects/1.json
  def update
    respond_to do |format|
      if @project.update(project_params)
        format.html { redirect_to @project, notice: 'Project was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: 'edit' }
        format.json { render json: @project.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /projects/1
  # DELETE /projects/1.json
  def destroy
    @project.destroy
    respond_to do |format|
      format.html { redirect_to projects_url }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_project
      @project = Project.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def project_params
      params.require(:project).permit(:name, :description, avatars_attributes: [:avatar])
      #tasks_attributes: [:id, :description, :done, :_destroy]
       #check here 
    end
end
