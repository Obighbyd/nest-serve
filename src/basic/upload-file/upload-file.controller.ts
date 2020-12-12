import {
  Controller,
  Get,
  Delete,
  Post,
  Query,
  Body,
  Param,
  UseInterceptors,
  UploadedFile,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiResponse, ApiConsumes, ApiBody, ApiParam } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadFileService } from './upload-file.service';
import { UploadQueryDto, CreateFileCreateDto, UploadDto, UploadResDto } from './upload-file.dto';
import { UploadFile } from './upload-file.entity';
import {
  DeleteDto,
  ApiOperation,
  getFileType,
  getKeys,
  fileType,
  serveConfig,
  PaginationDto,
  JwtPermissions,
  Permissions,
} from '../../common';
import filesize from 'filesize';

@JwtPermissions()
@ApiTags('文件')
@Controller('upload')
export class UploadFileController {
  constructor(private readonly uploadFileService: UploadFileService) {}

  @Permissions('admin')
  @Get()
  @ApiOperation('查询列表')
  @ApiResponse({ status: 200, type: class UploadFilePaginationDto extends PaginationDto(UploadFile) {} })
  findAll(@Query() data: UploadQueryDto) {
    return this.uploadFileService.pagination(data);
  }

  @Permissions('admin')
  @Post('install')
  @ApiOperation('添加文件')
  @ApiResponse({ status: 200, type: UploadResDto })
  async create(@Body() { name, ...data }: CreateFileCreateDto, @Req() req) {
    const type = getFileType(name);

    if (!type) throw new BadRequestException('禁止上传该类型文件');

    return this.uploadFileService.create({ ...data, name, type, username: req.user.username });
  }

  @Permissions('admin')
  @Delete()
  @ApiOperation('删除')
  async delete(@Body() { ids }: DeleteDto) {
    await this.uploadFileService.delete(ids);
  }

  @Post(':uploadType?')
  @ApiOperation('上传文件')
  @ApiConsumes('multipart/form-data')
  @ApiParam({
    name: 'uploadType',
    enum: getKeys(fileType),
    required: false,
    description: '上传文件类型，不选则上传任意类型文件',
  })
  @ApiBody({ type: UploadDto })
  @ApiResponse({ status: 200, type: UploadResDto })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file, @Param('uploadType') uploadType, @Req() req) {
    if (!file) throw new BadRequestException('请上传文件');
    const { originalname: name, path, size } = file;

    const type = getFileType(name);

    if (!type) throw new BadRequestException('禁止上传该类型文件');

    const url = path.split('/public')[1];

    if (!type || (uploadType && uploadType !== type)) {
      this.uploadFileService.deleteFile(url);
      throw new BadRequestException(
        fileType[uploadType] ? `请上传${fileType[uploadType]}类型文件` : '请输入正确的上传文件类型'
      );
    }

    const maxSize = serveConfig.file.find((i) => i.key === type).size;
    if (size > maxSize) {
      this.uploadFileService.deleteFile(url);
      throw new BadRequestException(`${fileType[type]}文件大小不能大于 ${filesize(maxSize)}`);
    }

    return this.uploadFileService.create({
      name,
      url,
      type,
      store: 'local',
      size: filesize(size),
      username: req.user.username,
    });
  }
}
