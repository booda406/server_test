json.array!(@image_projects) do |image_project|
  json.extract! image_project, :name, :framework, :image_url
  json.url image_project_url(image_project, format: :json)
end
