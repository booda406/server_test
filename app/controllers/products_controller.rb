class ProductsController < ApplicationController
  before_action :set_product, only: [:show, :edit, :update, :destroy]
 # before_action :authenticate_user!

  # GET /products
  # GET /products.json
  def index
    @products = Product.all
  end

  # GET /products/1
  # GET /products/1.json
  def show
  end

  # GET /products/new
  def new
    @product = Product.new
  end

  # GET /products/1/edit
  def edit
  end

  # POST /products
  # POST /products.json
  def create


    if request.format.json?
          #check if file is within picture_path
      if params[:image]["file"]
           picture_path_params = params[:image]
           #create a new tempfile named fileupload
           tempfile = Tempfile.new("fileupload")
           # tempfile.binmode
           #get the file and decode it with base64 then write it to the tempfile
           # tempfile.write(Base64.decode64(picture_path_params["file"]))
     
           #create a new uploaded file
           uploaded_file = ActionDispatch::Http::UploadedFile.new(:tempfile => tempfile, :filename => picture_path_params["filename"], :original_filename => picture_path_params["original_filename"]) 
     
           #replace picture_path with the new uploaded file
           params[:image] =  uploaded_file
     
      end
      @product = Product.new.permit!
    end
    
    @product = Product.new(product_params)
    
    @image = params[:image_field]

    @product.image = @image
    
    respond_to do |format|
      if @product.save
        format.html { redirect_to @product, notice: 'Product was successfully created.' }
        format.json { render action: 'show', status: :created, location: @product }
      else
        format.html { render action: 'new' }
        format.json { render json: @product.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /products/1
  # PATCH/PUT /products/1.json
  def update
    respond_to do |format|
      if @product.update(product_params)
        format.html { redirect_to @product, notice: 'Product was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: 'edit' }
        format.json { render json: @product.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /products/1
  # DELETE /products/1.json
  def destroy
    @product.destroy
    respond_to do |format|
      format.html { redirect_to products_url }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_product
      @product = Product.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def product_params
      params.require(:product).permit(:name, :description, :image)
    end
end
